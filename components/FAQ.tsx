"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FAQProps {
  faqs: {
    question: string
    answer: string
  }[]
  className?: string
}

export default function FAQ({ faqs, className = "" }: FAQProps) {
  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

