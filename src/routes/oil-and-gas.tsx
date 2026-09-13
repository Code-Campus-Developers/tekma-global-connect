import { createFileRoute } from "@tanstack/react-router";
import { IndustryPage } from "@/components/industry-page";
import { pageHead } from "@/lib/seo";
import image from "@/assets/tekma-energy-hero.jpg";

export const Route=createFileRoute("/oil-and-gas")({head:()=>pageHead("Oil and Gas Brokerage Nigeria | TEKMA","Global oil and gas brokerage connecting qualified crude oil and natural gas buyers, sellers and authorised mandates.","/oil-and-gas"),component:Page});
function Page(){return <IndustryPage eyebrow="Oil & Gas" title="Connecting opportunity across the energy value chain" copy="Credible introductions and disciplined engagement across crude oil, natural gas and related energy markets." image={image} processTitle="Energy brokerage built on credible connections" intro="TEKMA brings qualified parties together around clearly defined energy opportunities. We focus on the quality of the connection, direct communication where possible and professional transaction facilitation." items={["Crude Oil","Natural Gas","Energy Products","Qualified Buyers","Qualified Sellers","Authorised Mandates","Strategic Introductions"]}/>}