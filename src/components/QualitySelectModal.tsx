"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Download, Music2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type QualityOption = {
  value: string;
  label: string;
  quality: string;
  format: string;
};

interface QualitySelectModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  options: QualityOption[];
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function QualitySelectModal({
  isOpen,
  title,
  description,
  options,
  value,
  onChange,
  onClose,
  onConfirm,
}: QualitySelectModalProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-950/45 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed left-1/2 top-1/2 z-[110] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="relative overflow-hidden p-6">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_70%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_transparent_70%)]" />

              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-20 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300">
                  <Music2 className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
              </div>

              <div className="relative mt-6 grid gap-3">
                {options.map((option) => {
                  const active = option.value === value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onChange(option.value)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all",
                        active
                          ? "border-sky-300 bg-sky-50 text-sky-700 shadow-sm dark:border-sky-700 dark:bg-sky-950/40 dark:text-sky-200"
                          : "border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-sky-800 dark:hover:bg-slate-800/80"
                      )}
                    >
                      <div>
                        <div className="text-sm font-semibold">{option.label}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                          {option.quality} / {option.format}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full border",
                          active
                            ? "border-sky-500 bg-sky-500 text-white"
                            : "border-slate-300 text-transparent dark:border-slate-600"
                        )}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="text-xs leading-5 text-slate-400 dark:text-slate-500">
                  不支持所选音质的曲目会自动回退到该曲可用的最佳音质。
                </div>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-sky-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-600"
                >
                  <Download className="h-4 w-4" />
                  开始下载
                </button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
