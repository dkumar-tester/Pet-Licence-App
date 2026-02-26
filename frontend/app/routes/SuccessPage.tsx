import * as React from "react";
import { QRCodeSVG } from "qrcode.react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Download, Printer, Sparkles, User, FileText, Calendar, Dog } from "lucide-react";
import { format } from "date-fns";

export const SuccessPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  // Use a default ID if none provided, for demo purposes
  const licenceNumber = applicationId || "demo-12345";
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify-licence/${licenceNumber}`
      : `https://example.com/verify-licence/${licenceNumber}`;

  // Mock data for the success screen (in a real app, this would be fetched using the applicationId)
  const today = new Date();
  const formattedDate = format(today, "MM/dd/yyyy");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f0fdfa] to-[#dbeafe] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans">

      {/* Main Container */}
      <div className="w-full max-w-[500px] bg-white rounded-[32px] shadow-2xl overflow-hidden shadow-indigo-500/10">

        {/* Top Stepper Area */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f4f6] text-[#9ca3af] font-semibold text-sm">
                1
              </div>
              <span className="text-sm font-medium text-[#9ca3af]">Owner</span>
            </div>
            {/* Divider */}
            <div className="h-[2px] w-8 bg-[#e5e7eb] rounded-full" />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f4f6] text-[#9ca3af] font-semibold text-sm">
                2
              </div>
              <span className="text-sm font-medium text-[#9ca3af]">Pet</span>
            </div>
            {/* Divider */}
            <div className="h-[2px] w-8 bg-[#e5e7eb] rounded-full" />

            {/* Step 3 (Active) */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8b5cf6] text-white shadow-md shadow-[#8b5cf6]/30 font-semibold text-sm">
                3
              </div>
              <span className="text-sm font-bold text-[#8b5cf6]">Payment</span>
            </div>
          </div>

          {/* Success Header */}
          <div className="flex flex-col items-center text-center mt-2 mb-8">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-[#22c55e]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 tracking-tight">
              Payment Successful! <span className="text-yellow-400 text-xl">✨</span>
            </h1>
            <p className="text-[#6b7280] text-sm mt-1">
              Your pet registration is complete
            </p>
          </div>

          {/* Provisional License Card */}
          <div className="rounded-2xl border-2 border-[#06b6d4]/20 bg-[#f8fafc] overflow-hidden mb-8 relative">
            {/* Subtle top border highlight */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6]" />

            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-white">
              <div className="flex items-center gap-2 text-[#0f172a] font-bold">
                <FileText size={18} className="text-[#06b6d4]" />
                Provisional License
              </div>
              <span className="px-2.5 py-1 bg-[#dbeafe] text-[#2563eb] text-[11px] font-bold uppercase tracking-wider rounded-full">
                Provisional
              </span>
            </div>

            <div className="p-6 bg-white flex flex-col items-center">
              <div className="w-full text-center mb-6">
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">License Number</p>
                <p className="text-3xl font-black tracking-tight text-[#7c3aed]">{licenceNumber}</p>
              </div>

              {/* Details Grid */}
              <div className="w-full bg-slate-50 rounded-xl p-4 space-y-4 mb-6 border border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mb-1"><Dog size={12} /> Dog&apos;s Name</p>
                    <p className="text-sm font-semibold text-gray-900">N/A</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mb-1"><User size={12} /> Owner&apos;s Name</p>
                    <p className="text-sm font-semibold text-gray-900">N/A</p>
                  </div>
                </div>
                <div className="h-px w-full bg-slate-200" />
                <div>
                  <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mb-1"><Calendar size={12} /> Registration Date</p>
                  <p className="text-sm font-semibold text-gray-900">{formattedDate}</p>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <QRCodeSVG value={url} size={140} className="mb-3" />
                <p className="text-[11px] text-[#06b6d4] italic flex items-center gap-1">
                  <Sparkles size={10} /> Scan this QR code to verify license
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-2">
            <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white py-3.5 rounded-xl font-semibold shadow-md shadow-[#6366f1]/20 hover:shadow-lg hover:shadow-[#6366f1]/40 transition-all hover:-translate-y-0.5 active:translate-y-0">
              <Download size={18} />
              Download PDF License
            </button>

            <button className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#e0e7ff] text-[#6366f1] py-3 rounded-xl font-semibold hover:bg-[#f5f3ff] hover:border-[#c7d2fe] transition-all">
              <Printer size={18} />
              Print Receipt
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-[#eef2ff] p-5 border-t border-[#e0e7ff]">
          <div className="flex gap-3 items-start">
            <Sparkles className="text-[#6366f1] mt-0.5 shrink-0" size={18} />
            <p className="text-xs text-[#4f46e5] leading-relaxed">
              <span className="font-bold">Note:</span> Your official pet license and tags will be mailed to your registered address within 7-10 business days. This provisional license is valid until you receive your official documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
