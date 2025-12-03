"use client";

import { useState, useMemo } from "react";
import { Lock, HelpCircle, ChevronDown } from "lucide-react";
import type { FAQItem } from "@/types";

// Normalize helper - converts any FAQ format to standard FAQItem
function normalizeFAQItems(items: any[]): FAQItem[] {
  if (!items || items.length === 0) return [];
  
  return items.map((item, index) => {
    return {
      id: item.id || `faq-${index}`,
      question: item.question || item.q || 'Question',
      answer: item.answer || item.a || '',
      isPremium: item.isPremium || item.premium || false,
      orderIndex: item.orderIndex ?? item.order ?? index,
    };
  });
}

interface FAQSectionProps {
  faqs: any[];  // Accept any format for flexibility
  userIsPremium?: boolean;
  title?: string;
}

export function FAQSection({ faqs: rawFaqs, userIsPremium = false, title = "Frequently Asked Questions" }: FAQSectionProps) {
  // Normalize FAQs to standard format
  const faqs = useMemo(() => normalizeFAQItems(rawFaqs), [rawFaqs]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className="
        bg-[#F5F1E8] border-[4px] border-[#2C2416]
        shadow-[6px_6px_0_0_rgba(44,36,22,0.5)]
        p-5
      "
    >
      <h3 className="text-[18px] font-black text-[#2C2416] mb-5 flex items-center gap-2 pb-3 border-b-[3px] border-[#2C2416]">
        <div className="w-8 h-8 bg-[#9C27B0] border-[2px] border-[#2C2416] flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-white" />
        </div>
        {title}
      </h3>

      <div>
        {faqs.map((faq, index) => {
          const isLocked = faq.isPremium && !userIsPremium;
          const isOpen = openIndex === index;
          const isLast = index === faqs.length - 1;

          return (
            <div key={faq.id || index}>
              {/* Question */}
              <button
                onClick={() => toggleFaq(index)}
                className="
                  w-full flex items-center justify-between py-3
                  text-left hover:text-[#D35400]
                  transition-colors duration-150
                "
              >
                <span className="font-bold text-[#2C2416] pr-4 text-[14px] hover:text-[#D35400]">
                  {faq.question}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isLocked && (
                    <span
                      className="
                        px-1.5 py-0.5
                        bg-[#F5C542] text-[#2C2416]
                        border-[2px] border-[#2C2416]
                        text-[9px] font-black uppercase
                        flex items-center gap-1
                      "
                    >
                      <Lock className="w-2.5 h-2.5" />
                      Premium
                    </span>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-[#2C2416] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    strokeWidth={3}
                  />
                </div>
              </button>

              {/* Answer */}
              {isOpen && (
                <div className="pb-4">
                  {isLocked ? (
                    <div className="flex items-center gap-3 py-3 px-4 bg-[#E8E4DC] border-[2px] border-dashed border-[#7A7267]">
                      <Lock className="w-4 h-4 text-[#7A7267]" />
                      <p className="text-[#7A7267] font-medium text-[13px]">
                        This answer is for premium members only.
                        <button className="ml-2 text-[#2196F3] font-bold hover:text-[#D35400] underline">
                          Upgrade
                        </button>
                      </p>
                    </div>
                  ) : (
                    <p className="text-[#5A5247] leading-[1.7] font-medium text-[13px]">
                      {faq.answer}
                    </p>
                  )}
                </div>
              )}

              {/* Separator Line - Only if not last */}
              {!isLast && <div className="border-b-[2px] border-[#E8E4DC]" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
