"use client";

import Image from "next/image";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore, CartItem } from "@/lib/store/useCartStore";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1, item.size, item.color);
  };

  const handleDecrement = () => {
    updateQuantity(item.id, item.quantity - 1, item.size, item.color);
  };

  const handleRemove = () => {
    removeItem(item.id, item.size, item.color);
  };

  const itemPrice = item.price;
  const itemTotal = itemPrice * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 border-b border-neutral-200 dark:border-neutral-800 transition-all duration-300">
      <div className="flex gap-4 items-center w-full sm:w-auto">
        <div className="relative w-20 h-24 bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-neutral-900 dark:text-neutral-50 text-sm md:text-base leading-tight">
            {item.name}
          </h3>
          
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {item.color && (
              <span className="flex items-center gap-1">
                Warna: <span className="font-medium text-neutral-700 dark:text-neutral-300">{item.color}</span>
              </span>
            )}
            {item.size && (
              <span className="flex items-center gap-1">
                Ukuran: <span className="font-medium text-neutral-700 dark:text-neutral-300">{item.size}</span>
              </span>
            )}
          </div>
          
          <div className="mt-2 sm:hidden flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              Rp {itemPrice.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0">
        {/* Quantity Controls */}
        <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-full bg-white dark:bg-neutral-950 overflow-hidden shadow-sm">
          <button
            onClick={handleDecrement}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-semibold text-neutral-900 dark:text-neutral-50 select-none">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrement}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pricing & Remove Button */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block min-w-[100px]">
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              Rp {itemTotal.toLocaleString("id-ID")}
            </p>
            {item.quantity > 1 && (
              <p className="text-[10px] text-neutral-400">
                Rp {itemPrice.toLocaleString("id-ID")} / pcs
              </p>
            )}
          </div>
          
          <button
            onClick={handleRemove}
            className="p-2 text-neutral-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-all duration-200"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
