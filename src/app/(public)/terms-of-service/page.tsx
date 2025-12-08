import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Terms of Service - ${siteConfig.name}`,
    description: 'Terms of Service for UdyomX ORG - Rules and guidelines for using our services.',
};

export default function TermsOfServicePage() {
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
                        Terms of Service
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
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">1. Acceptance of Terms</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed">
                                By accessing and using {siteConfig.name} ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">2. Description of Service</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed mb-4">
                                {siteConfig.name} provides digital solutions including:
                            </p>
                            <ul className="list-disc list-inside text-[#5A5247] font-medium space-y-2 ml-4">
                                {siteConfig.services.map((service, index) => (
                                    <li key={index}>{service}</li>
                                ))}
                            </ul>
                            <p className="text-[#5A5247] font-medium leading-relaxed mt-4">
                                We also provide educational content, tutorials, documentation, and community resources for developers and businesses.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">3. User Accounts</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed mb-4">
                                To access certain features of the Service, you may be required to create an account:
                            </p>
                            <ul className="list-disc list-inside text-[#5A5247] font-medium space-y-2 ml-4">
                                <li>You must provide accurate and complete information</li>
                                <li>You are responsible for maintaining account security</li>
                                <li>You must notify us immediately of any unauthorized access</li>
                                <li>You are responsible for all activities under your account</li>
                                <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">4. User Conduct</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed mb-4">
                                You agree not to:
                            </p>
                            <ul className="list-disc list-inside text-[#5A5247] font-medium space-y-2 ml-4">
                                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Interfere with or disrupt the Service or servers</li>
                                <li>Upload malicious code or viruses</li>
                                <li>Harass, abuse, or harm other users</li>
                                <li>Impersonate any person or entity</li>
                                <li>Collect or store personal data of other users</li>
                                <li>Use automated systems to access the Service without permission</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">5. Intellectual Property</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed mb-4">
                                The Service and its original content, features, and functionality are owned by {siteConfig.name} and are protected by international copyright, trademark, and other intellectual property laws.
                            </p>
                            <p className="text-[#5A5247] font-medium leading-relaxed">
                                You may not copy, modify, distribute, sell, or lease any part of our services without explicit written permission. Code examples and tutorials may have separate licenses as specified in their documentation.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">6. Services and Payments</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed mb-4">
                                For paid services:
                            </p>
                            <ul className="list-disc list-inside text-[#5A5247] font-medium space-y-2 ml-4">
                                <li>Payment must be made in advance for services</li>
                                <li>Prices are subject to change with notice</li>
                                <li>Refunds are handled on a case-by-case basis</li>
                                <li>We reserve the right to refuse or cancel any order</li>
                                <li>All custom work requires a signed agreement</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">7. Content Submission</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed">
                                If you submit content to our Service (comments, feedback, suggestions), you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute that content. You represent that you have the right to submit such content.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">8. Disclaimer of Warranties</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed">
                                The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">9. Limitation of Liability</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed">
                                In no event shall {siteConfig.name}, its founders, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">10. Termination</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed">
                                We reserve the right to terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms of Service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">11. Governing Law</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed">
                                These Terms shall be governed by and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">12. Changes to Terms</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed">
                                We reserve the right to modify or replace these Terms at any time. We will provide notice of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-[#2C2416] mb-4">13. Contact Information</h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed mb-4">
                                If you have any questions about these Terms of Service, please contact us:
                            </p>
                            <div className="bg-[#F5F5F0] border-3 border-[#2C2416] p-4">
                                <p className="text-[#2C2416] font-bold">
                                    Email: <a href={`mailto:${siteConfig.contact.email}`} className="text-[#2196F3] hover:underline">{siteConfig.contact.email}</a>
                                </p>
                                <p className="text-[#2C2416] font-bold">
                                    Website: <a href={siteConfig.urls.website} className="text-[#2196F3] hover:underline" target="_blank" rel="noopener noreferrer">{siteConfig.urls.website}</a>
                                </p>
                                <p className="text-[#2C2416] font-bold">
                                    Location: {siteConfig.contact.location}
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
