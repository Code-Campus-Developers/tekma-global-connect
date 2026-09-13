import { createFileRoute } from "@tanstack/react-router";
import { IndustryPage } from "@/components/industry-page";
import { pageHead } from "@/lib/seo";
import image from "@/assets/tekma-advisory.jpg";

export const Route=createFileRoute("/consultancy")({head:()=>pageHead("Oil & Gas Transaction Consultancy | TEKMA","Tailored transaction consultancy, opportunity assessment, introductions and commercial coordination.","/consultancy"),component:Page});
function Page(){return <IndustryPage eyebrow="Consultancy" title="Advice built around the opportunity." copy="Practical consultancy tailored to the specific commercial context, parties and objectives of each engagement." image={image} processTitle="Focused support for complex commercial engagement" intro="TEKMA offers non-regulated consultancy designed around client needs. We do not provide legal, securities, investment or regulated financial advice and encourage parties to engage their own professional advisers." items={["Transaction Advisory","Opportunity Assessment","Strategic Introductions","Market Engagement","Commercial Advisory","Transaction Coordination"]}/>}