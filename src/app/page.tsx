import Link from "next/link";
import { MessageCircle, ClipboardList, TrendingUp } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "AI Consultation",
    description:
      "Describe your symptoms in plain language and receive thoughtful, structured follow-up questions to help you understand what you are experiencing.",
  },
  {
    icon: ClipboardList,
    title: "Symptom Logbook",
    description:
      "Keep a detailed, searchable record of every symptom entry so you always have your history at your fingertips.",
  },
  {
    icon: TrendingUp,
    title: "Trend Insights",
    description:
      "See how your symptoms change over time with visual charts and pattern detection that can reveal what your body is telling you.",
  },
];

const steps = [
  {
    number: "1",
    title: "Start a consultation",
    description:
      "Tell Courteney what you are experiencing in your own words. No medical jargon needed.",
  },
  {
    number: "2",
    title: "Answer follow-ups",
    description:
      "The AI asks gentle, relevant questions to build a complete picture of your symptoms.",
  },
  {
    number: "3",
    title: "Review and track",
    description:
      "Your structured symptom entry is saved to your logbook so you can track patterns and share with your provider.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-courteney-purple-50 to-courteney-pink-50">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Your health story, captured with care
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Courteney is an AI-assisted symptom tracker designed for
            women&apos;s reproductive health. Describe how you feel, and
            let the conversation guide you to a clearer picture.
          </p>
          <div className="mt-10">
            <Link href="/consult" className="btn-primary text-base px-8 py-4">
              Start a Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="card text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-courteney-purple-100">
                <feature.icon className="h-6 w-6 text-courteney-purple-600" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl font-bold text-gray-900">
            How it works
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-courteney-pink-100 font-display text-lg font-bold text-courteney-pink-500">
                  {step.number}
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer footer */}
      <footer className="border-t border-black/5 bg-courteney-warm-50 py-8">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-xs leading-relaxed text-gray-400">
            Courteney is not a substitute for professional medical advice,
            diagnosis, or treatment. Always consult a qualified healthcare
            provider with questions about your health. Information provided by
            this tool is for personal tracking purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
