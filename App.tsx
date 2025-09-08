import React, { useState, useCallback } from 'react';
import {
  PastProduct, SkinConditionCategory, SkincareRoutine, ChatMessage, FaceImage,
  CartItem, RoutineStep, AlternativeProduct
} from './types';
import Step1PastProducts from './components/Step1PastProducts';
import Step2FaceAnalysis from './components/Step2FaceAnalysis';
import Step3Goals from './components/Step3Goals';
import DoctorReport from './components/DoctorReport';
import Report from './components/Report';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import ChatbotPage from './components/ChatbotPage';

const App: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [pastProducts, setPastProducts] = useState<PastProduct[]>([]);
  const [faceImages, setFaceImages] = useState<FaceImage[]>([]);
  const [analysisResult, setAnalysisResult] = useState<SkinConditionCategory[] | null>(null);
  const [skincareGoals, setSkincareGoals] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<SkincareRoutine | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [routineTitle, setRoutineTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => setStep(prev => prev - 1);

  const resetState = useCallback(() => {
    faceImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setStep(1); setPastProducts([]); setFaceImages([]); setAnalysisResult(null);
    setSkincareGoals([]); setRecommendation(null); setChatHistory([]); setRoutineTitle('');
    setIsLoading(false); setCart([]); setIsCartOpen(false); setIsSidebarOpen(false);
  }, [faceImages]);

  const handleAddToCart = (p: RoutineStep | AlternativeProduct) => {
    setCart(prev => {
      const ex = prev.find(i => i.productId === p.productId);
      return ex ? prev.map(i => i.productId === p.productId ? { ...i, quantity: i.quantity + 1 } : i)
                : [...prev, { ...p, quantity: 1 }];
    });
  };

  const handleBulkAddToCart = (products: (RoutineStep | AlternativeProduct)[]) => {
    setCart(prev => {
      const map = new Map(prev.map(i => [i.productId, i]));
      const out = [...prev];
      products.forEach(p => {
        const ex = map.get(p.productId);
        if (ex) ex.quantity += 1;
        else { const it = { ...p, quantity: 1 }; out.push(it); map.set(it.productId, it); }
      });
      return out;
    });
  };

  const handleRemoveFromCart = (id: string) => setCart(prev => prev.filter(i => i.productId !== id));
  const handleUpdateQuantity = (id: string, q: number) =>
    q <= 0 ? handleRemoveFromCart(id)
           : setCart(prev => prev.map(i => i.productId === id ? { ...i, quantity: q } : i));

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1PastProducts onNext={handleNextStep} pastProducts={pastProducts} setPastProducts={setPastProducts} />;
      case 2: return (
        <Step2FaceAnalysis
          onNext={handleNextStep} onBack={handlePrevStep}
          faceImages={faceImages} setFaceImages={setFaceImages}
          analysisResult={analysisResult} setAnalysisResult={setAnalysisResult}
          setIsLoading={setIsLoading} isLoading={isLoading}
        />
      );
      case 3: return (
        <Step3Goals
          onBack={handlePrevStep} analysisResult={analysisResult}
          setSkincareGoals={setSkincareGoals} skincareGoals={skincareGoals}
          pastProducts={pastProducts} setRecommendation={setRecommendation}
          setRoutineTitle={setRoutineTitle} setStep={setStep}
          setIsLoading={setIsLoading} isLoading={isLoading}
        />
      );
      case 4: return (
        <Report
          recommendation={recommendation} routineTitle={routineTitle}
          onReset={resetState} onBack={handlePrevStep} onNext={handleNextStep}
          faceImages={faceImages} analysisResult={analysisResult} skincareGoals={skincareGoals}
          onAddToCart={handleAddToCart} onBulkAddToCart={handleBulkAddToCart}
        />
      );
      case 5: return (
        <DoctorReport
          recommendation={recommendation} routineTitle={routineTitle}
          onReset={resetState} onBack={handlePrevStep} onNext={handleNextStep}
          faceImages={faceImages} analysisResult={analysisResult} skincareGoals={skincareGoals}
        />
      );
      case 6: return (
        <ChatbotPage
          analysisResult={analysisResult} skincareGoals={skincareGoals} recommendation={recommendation}
          chatHistory={chatHistory} setChatHistory={setChatHistory}
          onBack={handlePrevStep} onReset={resetState}
        />
      );
      default: return <p>Invalid Step</p>;
    }
  };

  const totalCartItems = cart.reduce((t, i) => t + i.quantity, 0);

  return (
    <div className="w-full h-full overflow-hidden lg:grid lg:grid-cols-[350px,1fr] bg-brand-bg">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />
      )}

      <Sidebar
        currentStep={step} onReset={resetState}
        onCartClick={() => setIsCartOpen(true)} cartItemCount={totalCartItems}
        isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}
      />

      <div className="w-full h-full relative">
        <Header
          onReset={resetState}
          onCartClick={() => setIsCartOpen(true)}
          cartItemCount={totalCartItems}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Only this area scrolls. Offset = --header-h (0 on lg where header is hidden) */}
        <main
          className="fixed left-0 right-0 bottom-0 overflow-y-auto px-2 sm:px-3 md:px-4"
          style={{ top: 'var(--header-h)' }}
        >
          {step === 4 ? (
            renderStep()
          ) : (
            <div
              className="bg-brand-surface rounded-2xl shadow-lifted p-6 sm:p-8 flex flex-col border-t-4 border-brand-primary"
              style={{ minHeight: 'calc(100dvh - var(--header-h))' }}
            >
              {renderStep()}
            </div>
          )}
        </main>
      </div>

      <CartDrawer
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}
        cartItems={cart} onRemove={handleRemoveFromCart} onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
};

export default App;
