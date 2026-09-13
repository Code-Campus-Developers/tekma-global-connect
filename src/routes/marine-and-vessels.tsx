import { createFileRoute } from "@tanstack/react-router";
import { IndustryPage } from "@/components/industry-page";
import { pageHead } from "@/lib/seo";
import image from "@/assets/tekma-marine.jpg";

export const Route=createFileRoute("/marine-and-vessels")({head:()=>pageHead("Marine & Vessel Brokerage | TEKMA Global Partners","Vessel brokerage connecting qualified maritime buyers, sellers, asset owners and authorised mandates globally.","/marine-and-vessels"),component:Page});
function Page(){return <IndustryPage eyebrow="Marine & Vessel Brokerage" title="Maritime opportunities. Connected globally." copy="Professional connections for marine vessel buyers, sellers, asset owners and authorised mandates." image={image} processTitle="Commercial clarity across maritime opportunities" intro="Marine assets call for accurate requirements, credible parties and disciplined communication. TEKMA supports the connection and engagement process without overstating its role." items={["Commercial Vessels","Oil and Product Tankers","Vessel Acquisition","Vessel Disposal","Asset Owners","Qualified Buyers","Authorised Mandates"]}/>}