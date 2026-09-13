import { createFileRoute } from "@tanstack/react-router";
import { IndustryPage } from "@/components/industry-page";
import { pageHead } from "@/lib/seo";
import image from "@/assets/tekma-energy-hero.jpg";

export const Route=createFileRoute("/acreage-and-assets")({head:()=>pageHead("Energy Asset & Oil Block Brokerage | TEKMA","Brokerage and strategic introductions for oil blocks, acreages, producing assets, acquisitions and disposals.","/acreage-and-assets"),component:Page});
function Page(){return <IndustryPage eyebrow="Acreage & Asset Brokerage" title="Strategic energy assets. Global connections." copy="Connecting credible asset owners, buyers, sellers and authorised mandates around upstream energy opportunities." image={image} processTitle="Connecting credible parties around strategic assets" intro="TEKMA facilitates introductions and transaction engagement. Our role is to help suitable counterparties establish a professional dialogue; we do not imply ownership of the opportunities presented." items={["Oil Blocks","Oil & Gas Acreages","Producing Assets","Exploration Opportunities","Asset Acquisition","Asset Disposal","Buyer and Seller Introductions"]}/>}