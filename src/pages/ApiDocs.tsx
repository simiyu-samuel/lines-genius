import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Copy, 
  CheckCircle, 
  Key, 
  Globe, 
  Shield,
  Zap,
  Book,
  Terminal,
  ArrowRight
} from 'lucide-react';

export const ApiDocs: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Book },
    { id: 'authentication', label: 'Authentication', icon: Key },
    { id: 'endpoints', label: 'Endpoints', icon: Globe },
    { id: 'examples', label: 'Examples', icon: Code },
    { id: 'sdks', label: 'SDKs', icon: Terminal }
  ];

  const endpoints = [
    {
      method: 'POST',
      path: '/api/v1/generate',
      description: 'Generate creative lines',
      params: [
        { name: 'category', type: 'string', required: true, description: 'Line category (taglines, bios, captions, etc.)' },
        { name: 'tone', type: 'string', required: false, description: 'Tone of the lines (funny, corporate, bold, etc.)' },
        { name: 'prompt', type: 'string', required: false, description: 'Custom prompt for generation' },
        { name: 'count', type: 'number', required: false, description: 'Number of lines to generate (1-10, default: 4)' }
      ]
    },
    {
      method: 'GET',
      path: '/api/v1/usage',
      description: 'Get current usage statistics',
      params: []
    },
    {
      method: 'GET',
      path: '/api/v1/plans',
      description: 'Get available subscription plans',
      params: []
    },
    {
      method: 'POST',
      path: '/api/v1/save-line',
      description: 'Save a generated line',
      params: [
        { name: 'text', type: 'string', required: true, description: 'The line text to save' },
        { name: 'category', type: 'string', required: true, description: 'Line category' },
        { name: 'tone', type: 'string', required: true, description: 'Line tone' }
      ]
    }
  ];

  const codeExamples = {
    javascript: `// JavaScript/Node.js Example
const response = await fetch('https://api.linesgenius.com/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    category: 'taglines',
    tone: 'corporate',
    prompt: 'AI-powered productivity app',
    count: 5
  })
});

const data = await response.json();
console.log(data.lines);`,

    python: `# Python Example
import requests

url = "https://api.linesgenius.com/v1/generate"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "category": "taglines",
    "tone": "corporate", 
    "prompt": "AI-powered productivity app",
    "count": 5
}

response = requests.post(url, headers=headers, json=data)
lines = response.json()["lines"]
print(lines)`,

    curl: `# cURL Example
curl -X POST https://api.linesgenius.com/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "category": "taglines",
    "tone": "corporate",
    "prompt": "AI-powered productivity app",
    "count": 5
  }'`
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Lines Genius API
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The Lines Genius API allows you to integrate our AI-powered creative line generation 
                directly into your applications. Generate taglines, social media content, marketing copy, 
                and more with simple HTTP requests.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: 'Fast & Reliable',
                  description: 'Sub-second response times with 99.9% uptime SLA'
                },
                {
                  icon: Shield,
                  title: 'Secure',
                  description: 'Enterprise-grade security with API key authentication'
                },
                {
                  icon: Globe,
                  title: 'Global CDN',
                  description: 'Distributed globally for optimal performance'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white/50 dark:bg-dark-700/50 rounded-lg p-4 border border-gray-200 dark:border-neon-purple/20">
                  <feature.icon className="h-8 w-8 text-neon-purple mb-3" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 rounded-lg p-6 border border-neon-purple/20">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Base URL
              </h4>
              <code className="text-neon-purple font-mono">
                https://api.linesgenius.com/v1
              </code>
            </div>
          </div>
        );

      case 'authentication':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Authentication
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The Lines Genius API uses API keys for authentication. Include your API key 
                in the Authorization header of all requests.
              </p>
            </div>

            <div className="bg-white/50 dark:bg-dark-700/50 rounded-lg p-6 border border-gray-200 dark:border-neon-purple/20">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Getting Your API Key
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Sign up for a Business plan</li>
                <li>Go to your dashboard settings</li>
                <li>Navigate to the API section</li>
                <li>Generate a new API key</li>
                <li>Copy and securely store your key</li>
              </ol>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Authorization Header</span>
                <button
                  onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 'auth-header')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {copiedCode === 'auth-header' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <code className="text-green-400 font-mono text-sm">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                Security Best Practices
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                <li>Never expose your API key in client-side code</li>
                <li>Use environment variables to store your key</li>
                <li>Rotate your API keys regularly</li>
                <li>Monitor your API usage for unusual activity</li>
              </ul>
            </div>
          </div>
        );

      case 'endpoints':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                API Endpoints
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Complete reference for all available API endpoints.
              </p>
            </div>

            <div className="space-y-6">
              {endpoints.map((endpoint, index) => (
                <div key={index} className="bg-white/50 dark:bg-dark-700/50 rounded-lg p-6 border border-gray-200 dark:border-neon-purple/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      endpoint.method === 'GET' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-neon-purple font-mono">
                      {endpoint.path}
                    </code>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {endpoint.description}
                  </p>

                  {endpoint.params.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Parameters
                      </h5>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="text-left py-2 text-gray-900 dark:text-white">Name</th>
                              <th className="text-left py-2 text-gray-900 dark:text-white">Type</th>
                              <th className="text-left py-2 text-gray-900 dark:text-white">Required</th>
                              <th className="text-left py-2 text-gray-900 dark:text-white">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {endpoint.params.map((param, paramIndex) => (
                              <tr key={paramIndex} className="border-b border-gray-100 dark:border-gray-800">
                                <td className="py-2 font-mono text-neon-purple">{param.name}</td>
                                <td className="py-2 text-gray-600 dark:text-gray-300">{param.type}</td>
                                <td className="py-2">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    param.required 
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                  }`}>
                                    {param.required ? 'Required' : 'Optional'}
                                  </span>
                                </td>
                                <td className="py-2 text-gray-600 dark:text-gray-300">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'examples':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Code Examples
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Ready-to-use code examples in popular programming languages.
              </p>
            </div>

            <div className="space-y-6">
              {Object.entries(codeExamples).map(([language, code]) => (
                <div key={language} className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                    <span className="text-gray-300 font-medium capitalize">
                      {language === 'javascript' ? 'JavaScript' : language.toUpperCase()}
                    </span>
                    <button
                      onClick={() => copyToClipboard(code, language)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedCode === language ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto">
                    <code className="text-green-400 text-sm font-mono">
                      {code}
                    </code>
                  </pre>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                Response Format
              </h4>
              <pre className="text-sm text-blue-700 dark:text-blue-300 font-mono">
{`{
  "success": true,
  "lines": [
    "Revolutionize your workflow with AI",
    "Smart productivity, simplified",
    "Where efficiency meets innovation",
    "Your AI-powered productivity partner"
  ],
  "usage": {
    "remaining": 95,
    "total": 100
  }
}`}
              </pre>
            </div>
          </div>
        );

      case 'sdks':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Official SDKs
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Use our official SDKs to integrate Lines Genius into your applications quickly and easily.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: 'JavaScript/Node.js',
                  package: 'npm install @linesgenius/sdk',
                  description: 'Official SDK for JavaScript and Node.js applications',
                  status: 'Available'
                },
                {
                  name: 'Python',
                  package: 'pip install linesgenius',
                  description: 'Official SDK for Python applications',
                  status: 'Available'
                },
                {
                  name: 'PHP',
                  package: 'composer require linesgenius/sdk',
                  description: 'Official SDK for PHP applications',
                  status: 'Coming Soon'
                },
                {
                  name: 'Ruby',
                  package: 'gem install linesgenius',
                  description: 'Official SDK for Ruby applications',
                  status: 'Coming Soon'
                }
              ].map((sdk, index) => (
                <div key={index} className="bg-white/50 dark:bg-dark-700/50 rounded-lg p-6 border border-gray-200 dark:border-neon-purple/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {sdk.name}
                    </h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      sdk.status === 'Available'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {sdk.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {sdk.description}
                  </p>

                  <div className="bg-gray-900 rounded p-3">
                    <code className="text-green-400 text-sm font-mono">
                      {sdk.package}
                    </code>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 rounded-lg p-6 border border-neon-purple/20">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Quick Start with JavaScript SDK
              </h4>
              <div className="bg-gray-900 rounded-lg p-4">
                <pre className="text-green-400 text-sm font-mono">
{`import { LinesGenius } from '@linesgenius/sdk';

const client = new LinesGenius('YOUR_API_KEY');

const lines = await client.generate({
  category: 'taglines',
  tone: 'corporate',
  count: 5
});

console.log(lines);`}
                </pre>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            API Documentation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Integrate Lines Genius into your applications with our powerful REST API. 
            Generate creative content programmatically with simple HTTP requests.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-neon-purple/20 shadow-xl sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Documentation
              </h3>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                        : 'text-gray-600 dark:text-gray-300 hover:text-neon-purple dark:hover:text-neon-cyan hover:bg-white/50 dark:hover:bg-dark-700/50'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Need Help?
                </h4>
                <div className="space-y-2">
                  <a
                    href="/contact"
                    className="block text-sm text-gray-600 dark:text-gray-300 hover:text-neon-purple dark:hover:text-neon-cyan transition-colors"
                  >
                    Contact Support
                  </a>
                  <a
                    href="/community"
                    className="block text-sm text-gray-600 dark:text-gray-300 hover:text-neon-purple dark:hover:text-neon-cyan transition-colors"
                  >
                    Join Community
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl p-8 border border-white/20 dark:border-neon-purple/20 shadow-xl">
              {renderTabContent()}
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 rounded-2xl p-8 text-center border border-neon-purple/30"
        >
          <Code className="h-16 w-16 text-neon-cyan mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Upgrade to a Business plan to get API access and start integrating 
            Lines Genius into your applications today.
          </p>
          
          <motion.a
            href="/pricing"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:shadow-neon-purple/25"
          >
            <span>Get API Access</span>
            <ArrowRight className="h-5 w-5" />
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};