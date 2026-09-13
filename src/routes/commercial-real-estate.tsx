import { createFileRoute } from "@tanstack/react-router";
import { IndustryPage } from "@/components/industry-page";
import { pageHead } from "@/lib/seo";
import image from "@/assets/tekma-property.jpg";

export const Route=createFileRoute("/commercial-real-estate")({head:()=>pageHead("Commercial Real Estate Brokerage | TEKMA","Commercial property and land brokerage connecting credible owners, buyers, sellers and investors.","/commercial-real-estate"),component:Page});
function Page(){return <IndustryPage eyebrow="Commercial Real Estate" title="Strategic property. Valuable connections." copy="Connecting credible parties around commercial property, land and strategic real estate opportunities." image={image} processTitle="Property opportunities shaped by commercial purpose" intro="TEKMA supports introductions between owners, sellers, qualified buyers and interested investors. Each opportunity is approached on its own facts, without invented listings or implied ownership." items={["Commercial Property","Land","Investment Property","Strategic Real Estate","Asset Owners","Qualified Buyers","Buyer and Seller Introductions"]}/>}