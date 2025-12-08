import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Privacy Policy - ${siteConfig.name}`,
    description: 'Privacy Policy for UdyomX ORG - How we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#F5F5F0]">
            {/* Header */}
            <div className="bg-[#2C2416] border-b-[4px] border-[#F5C542]">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 mb-4 text-[#F5F1E8] hover:text-[#F5C542] font-semibold transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>
                    
                    <h1 className="text-3xl md:text-4xl font-black text-[#F5F1E8] mb-2">
                        Privacy Policy
                    </h1>
                    <p className="text-[#A8A499] font-medium text-lg">
                        Last updated: December 9, 2025
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                    <div className="prose prose-lg max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">1. Information We Collect</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed mb-4">
                                At {siteConfig.name}, we collect information that you provide directly to us when you:
                            </p>
                            <ul className="list-disc list-inside text-[#5A5247] font-medium space-y-2 ml-4">
                                <li>Create an account or sign in using Google OAuth</li>
                                <li>Use our services or request information</li>
                                <li>Contact us through our website or email</li>
                                <li>Subscribe to newsletters or updates</li>
                                <li>Submit content or participate in community features</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">2. How We Use Your Information</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed mb-4">
                                We use the collected information for:
                            </p>
                            <ul className="list-disc list-inside text-[#5A5247] font-medium space-y-2 ml-4">
                                <li>Providing, maintaining, and improving our services</li>
                                <li>Processing your requests and transactions</li>
                                <li>Sending you technical notices and support messages</li>
                                <li>Communicating with you about services, updates, and promotional content</li>
                                <li>Monitoring and analyzing trends, usage, and activities</li>
                                <li>Detecting, preventing, and addressing technical issues</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">3. Information Sharing</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed mb-4">
                                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                            </p>
                            <ul className="list-disc list-inside text-[#5A5247] font-medium space-y-2 ml-4">
                                <li>With your consent or at your direction</li>
                                <li>With service providers who assist in our operations</li>
                                <li>To comply with legal obligations</li>
                                <li>To protect our rights, privacy, safety, or property</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">4. Data Security</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed">
                                We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure. We use Supabase for secure data storage and Google OAuth for authentication.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">5. Your Rights</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed mb-4">
                                You have the right to:
                            </p>
                            <ul className="list-disc list-inside text-[#5A5247] font-medium space-y-2 ml-4">
                                <li>Access and receive a copy of your personal information</li>
                                <li>Correct or update your information</li>
                                <li>Request deletion of your account and data</li>
                                <li>Object to processing of your information</li>
                                <li>Withdraw consent at any time</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">6. Cookies and Tracking</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed">
                                We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">7. Children's Privacy</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed">
                                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">8. Changes to This Policy</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed">
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">9. Contact Us</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed mb-4">
                                If you have any questions about this Privacy Policy, please contact us:
                            </p>
                            <div className="bg-[#F5F5F0] border-3 border-[#2C2416] p-4">
                                <p className="text-[#2C2416] font-bold">
                                    Email: <a href={`mailto:${siteConfig.contact.email}`} className="text-[#2196F3] hover:underline">{siteConfig.contact.email}</a>
                                </p>
                                <p className="text-[#2C2416] font-bold">
                                    Website: <a href={siteConfig.urls.website} className="text-[#2196F3] hover:underline" target="_blank" rel="noopener noreferrer">{siteConfig.urls.website}</a>
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
