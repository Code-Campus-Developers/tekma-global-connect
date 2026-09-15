import { createFileRoute } from "@tanstack/react-router";
import { CTASection, PageHero } from "@/components/site-components";
import { pageHead } from "@/lib/seo";
import image from "@/assets/tekma-advisory.jpg";
import chairmanPhoto from "@/assets/handsome-young-businessman-suit_273609-6513.avif";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    ...pageHead(
      "Dr. Edmund Olu Ayoola | TEKMA Chairman",
      "Profile of Dr. Edmund Olu Ayoola, geologist and former NNPC Group Executive Director, Exploration and Production.",
      "/leadership",
      "profile",
    ),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Dr. Edmund Olu Ayoola",
          jobTitle: "Chairman",
          worksFor: { "@type": "Organization", name: "TEKMA Global Partners Limited" },
          alumniOf: { "@type": "CollegeOrUniversity", name: "Imperial College London" },
        }),
      },
    ],
  }),
  component: Leadership,
});
function Leadership() {
  return (
    <>
      <PageHero
        eyebrow="Leadership"
        title="Experience at the highest level"
        copy="A career shaped by geology, upstream energy leadership and major national gas initiatives."
        image={image}
      />
      <article className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[.7fr_1.3fr] lg:px-8 lg:py-28">
        <aside>
          <div className="aspect-[4/5] overflow-hidden bg-gradient-to-br from-petroleum to-navy">
            <img
              src={chairmanPhoto}
              alt="Dr. Edmund Olu Ayoola, Chairman of TEKMA Global Partners"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[.18em] text-petroleum">
            Chairman
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy">Dr. Edmund Olu Ayoola</h2>
        </aside>
        <div className="space-y-6 text-base leading-8 text-muted-foreground">
          <p className="text-xl leading-9 text-foreground">
            Dr. Edmund Olu Ayoola is a geologist and former Group Executive Director, Exploration
            and Production, of the Nigerian National Petroleum Corporation.
          </p>
          <p>
            In that role, he was responsible for major upstream oil and gas activities and
            supervised organisations including NAPIMS, Integrated Data Services Limited, Nigerian
            Gas Company and Nigerian Petroleum Development Company.
          </p>
          <p>
            He previously served as Managing Director of Nigerian Petroleum Development Company
            Limited and held senior leadership responsibilities in the Gas Division and NAPIMS.
          </p>
          <p>
            During his NNPC career, Dr. Ayoola represented the corporation on several NLNG
            technical, commercial, advisory and shareholder committees. His responsibilities also
            included participation in national gas-utilisation initiatives and the West African Gas
            Pipeline.
          </p>
          <p>
            Before joining NNPC, he worked with the Geological Survey Office of the Federal
            Government of Nigeria and Mobil Producing Nigeria as a Wellsite Geologist.
          </p>
          <section className="mt-10 border-t border-border pt-8">
            <h2 className="text-2xl font-bold text-navy">Education</h2>
            <ul className="mt-5 space-y-4">
              <li>
                <strong className="text-foreground">B.Sc. Geology</strong> — 1971
              </li>
              <li>
                <strong className="text-foreground">M.Sc. Petroleum Geology</strong> — Imperial
                College London, 1975
              </li>
              <li>
                <strong className="text-foreground">Ph.D. Sedimentology</strong> — Imperial College
                London, 1978
              </li>
            </ul>
            <p className="mt-6">He is a member of several professional societies.</p>
          </section>
        </div>
      </article>
      <CTASection />
    </>
  );
}
