import { getCollegesByCity } from "@/lib/events";
import { SubmitForm } from "@/components/submit-form";
import { DEFAULT_CITY_SLUG } from "@/lib/constants";

export const metadata = {
  title: "Add event nearby · Trackr",
  description: "Crowdsource a hackathon or meetup in Bangalore",
};

export default async function SubmitPage() {
  const colleges = await getCollegesByCity(DEFAULT_CITY_SLUG);

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-white">Add event nearby</h1>
      <p className="mb-8 text-sm text-zinc-400">
        Found a hackathon on Instagram or a WhatsApp group? Submit it here.
        Goes to moderation before appearing on the feed.
      </p>
      <SubmitForm colleges={colleges} />
    </div>
  );
}
