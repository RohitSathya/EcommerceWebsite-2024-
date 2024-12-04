import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Plus, Minus } from 'lucide-react';
import { Alert, AlertDescription } from './components/ui/alert'

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'orders', name: 'Orders & Shipping' },
    { id: 'returns', name: 'Returns & Refunds' },
    { id: 'products', name: 'Products' },
    { id: 'account', name: 'Account & Security' },
    { id: 'payment', name: 'Payment & Pricing' }
  ];

  const faqData = [
    {
      category: 'orders',
      question: 'How can I track my order?',
      answer: 'You can track your order by logging into your account and visiting the "Orders" section. Click on your order number to view detailed tracking information. We also send tracking updates via email once your order ships.'
    },
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Products must be unused and in their original packaging. To initiate a return, log into your account and select the order containing the item you wish to return. Then follow the prompts to generate a return label.'
    },
    {
      category: 'products',
      question: 'Do you offer warranty on products?',
      answer: 'Yes, all our products come with a standard manufacturer warranty. The warranty period varies by product and brand. You can find specific warranty information on each product page or in the documentation that comes with your purchase.'
    },
    {
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'To reset your password, click on the "Forgot Password" link on the login page. Enter your email address, and we\'ll send you instructions to create a new password. For security reasons, password reset links expire after 24 hours.'
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. For certain regions, we also offer financing options and buy-now-pay-later services through our partners.'
    },
    {
      category: 'orders',
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days within the continental US. Express shipping (1-2 business days) is available for most items. International shipping times vary by destination. You can view estimated delivery dates during checkout.'
    }
  ];

  const toggleQuestion = (index) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            How can we help you?
          </h1>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105
                ${activeCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow'}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFAQs.length === 0 ? (
            <Alert>
              <AlertDescription className="text-center py-4">
                No FAQ matches your search. Try different keywords or browse all categories.
              </AlertDescription>
            </Alert>
          ) : (
            filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center gap-4"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {expandedQuestions[index] ? (
                    <Minus className="flex-shrink-0 text-blue-600" />
                  ) : (
                    <Plus className="flex-shrink-0 text-blue-600" />
                  )}
                </button>
                {expandedQuestions[index] && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Please chat with our friendly team.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;