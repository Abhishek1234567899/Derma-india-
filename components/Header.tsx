import React from 'react';
import { CompanyLogo, RefreshCw, ShoppingCartIcon, MenuIcon, ExternalLinkIcon } from './Icons';
import Button from './common/Button';

interface HeaderProps {
  onReset: () => void;
  onCartClick: () => void;
  cartItemCount: number;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset, onCartClick, cartItemCount, onMenuClick }) => {
  return (
    <header className="w-full mx-auto h-12 px-3 flex items-center justify-between lg:hidden fixed top-0 left-0 right-0 bg-white z-50 shadow-sm border-b border-slate-200">
      <div className="flex items-center gap-1.5">
        <button
          onClick={onMenuClick}
          className="p-1 rounded-full hover:bg-black/10 transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon className="w-5 h-5 text-brand-text-muted" />
        </button>
        <a href="https://dermatics.in" target="_blank" rel="noopener noreferrer">
          <CompanyLogo className="w-16 h-auto" />
        </a>
      </div>

      <div className="flex items-center gap-1.5">
        <Button onClick={onReset} variant="secondary" size="sm" className="gap-1 px-2 py-1">
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm">Reset</span>
        </Button>

        <Button
          as="a"
          href="https://dermatics.in"
          target="_blank"
          rel="noopener noreferrer"
          title="Visit Dermatics.in"
          variant="secondary"
          size="sm"
          className="relative !rounded-full !p-1.5"
        >
          <ExternalLinkIcon className="w-5 h-5" />
        </Button>

        <Button
          onClick={onCartClick}
          variant="secondary"
          size="sm"
          className="relative !rounded-full !p-1.5"
        >
          <ShoppingCartIcon className="w-5 h-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-secondary text-[10px] font-bold text-white shadow-lg">
              {cartItemCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
