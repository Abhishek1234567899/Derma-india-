import React, { useState, useCallback } from 'react';
import {
  PastProduct, SkinConditionCategory, SkincareRoutine, ChatMessage,
  FaceImage, CartItem, RoutineStep, AlternativeProduct
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
    faceImages.forEach(image => URL.revokeObjectURL(image.previewUrl));
    setStep(1);
    setPastProducts([]);
    setFaceImages([]);
    setAnalysisResult(null);
    setSkincareGoals([]);
    setRecommendation(null);
    setChatHistory([]);
    setRoutineTitle('');
    setIsLoading(false);
    setCart([]);
    setIsCartOpen(false);
    setIsSidebarOpen(false);
  }, [faceImages]);

  const handleAddToCart = (product: RoutineStep | AlternativeProduct) => {
    setCart(prevCart => {
      const existing = prevCart.find(i => i.productId === product.productId);
      if (existing) {
        return prevCart.map(i => i.productId === product.productId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleBulkAddToCart = (products: (RoutineStep | AlternativeProduct)[]) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      const map = new Map(newCart.map(i => [i.productId, i]));
      products.forEach(p => {
        const ex = map.get(p.productId);
        if (ex) ex.quantity += 1;
        else {
          const item: CartItem = { ...p, quantity: 1 };
          newCart.push(item);
          map.set(item.productId, item);
        }
      });
      return newCart;
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(i => i.productId !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return handleRemoveFromCart(productId);
    setCart(prevCart => prevCart.map(i => i.productId === productId ? { ...i, quantity } : i));
  };

  // Compact centered card with extra bottom gap
  const StepCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-full flex justify-center">
      <div
        className="
          w-full max-w-3xl
          bg-brand-surface rounded-xl shadow-soft border border-slate-200/60
          p-4 sm:p-6
          mt-4 mb-12   /* top small, bottom larger => card sits a bit higher */
        "
      >
        {children}
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1PastProducts onNext={handleNextStep} pastProducts={pastProducts} setPastProducts={setPastProducts} />;
      case 2:
        return (
          <Step2FaceAnalysis
            onNext={handleNextStep}
            onBack={handlePrevStep}
            faceImages={faceImages}
            setFaceImages={setFaceImages}
            analysisResult={analysisResult}
            setAnalysisResult={setAnalysisResult}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <Step3Goals
            onBack={handlePrevStep}
            analysisResult={analysisResult}
            setSkincareGoals={setSkincareGoals}
            skincareGoals={skincareGoals}
            pastProducts={pastProducts}
            setRecommendation={setRecommendation}
            setRoutineTitle={setRoutineTitle}
            setStep={setStep}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />
        );
      case 4:
        return (
          <Report
            recommendation={recommendation}
            routineTitle={routineTitle}
            onReset={resetState}
            onBack={handlePrevStep}
            onNext={handleNextStep}
            faceImages={faceImages}
            analysisResult={analysisResult}
            skincareGoals={skincareGoals}
            onAddToCart={handleAddToCart}
            onBulkAddToCart={handleBulkAddToCart}
          />
        );
      case 5:
        return (
          <DoctorReport
            recommendation={recommendation}
            routineTitle={routineTitle}
            onReset={resetState}
            onBack={handlePrevStep}
            onNext={handleNextStep}
            faceImages={faceImages}
            analysisResult={analysisResult}
            skincareGoals={skincareGoals}
          />
        );
      case 6:
        return (
          <ChatbotPage
            analysisResult={analysisResult}
            skincareGoals={skincareGoals}
            recommendation={recommendation}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            onBack={handlePrevStep}
            onReset={resetState}
          />
        );
      default:
        return <p>Invalid Step</p>;
    }
  };

  const totalCartItems = cart.reduce((t, i) => t + i.quantity, 0);

  return (
    <div className="w-full h-screen overflow-hidden lg:grid lg:grid-cols-[350px,1fr] bg-brand-bg">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        currentStep={step}
        onReset={resetState}
        onCartClick={() => setIsCartOpen(true)}
        cartItemCount={totalCartItems}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Page scroll locked; header fixed */}
      <div className="w-full h-screen flex flex-col">
        <Header
          onReset={resetState}
          onCartClick={() => setIsCartOpen(true)}
          cartItemCount={totalCartItems}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* header 56px => pt-14 ; main NOT scrollable */}
        <main className="w-full flex-grow overflow-hidden px-2 sm:px-3 md:px-4 pt-14 pb-6">
          <StepCard>{renderStep()}</StepCard>
        </main>
      </div>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
};

export default App;
