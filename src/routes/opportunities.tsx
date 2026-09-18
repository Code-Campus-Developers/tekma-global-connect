import { createFileRoute } from "@tanstack/react-router";
import { OpportunityForm } from "@/components/forms";
import { PageHero, SectionHeading } from "@/components/site-components";
import { pageHead } from "@/lib/seo";
import image from "@/assets/tekma-advisory.jpg";

export const Route=createFileRoute("/opportunities")({head:()=>pageHead("Submit a Global Opportunity | TEKMA","Approach TEKMA with a credible energy, acreage, vessel, land or commercial property opportunity.","/opportunities"),component:Opportunities});
function Opportunities(){return <><PageHero eyebrow="Global opportunities" title="Let's explore the opportunity." copy="A confidential first step for genuine asset owners, sellers, buyers, investors and duly authorised mandate holders." image={image}/><section><div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[.7fr_1.3fr] lg:px-8 lg:py-28"><div><SectionHeading eyebrow="Opportunity submission" title="Share the essential details" copy="Provide enough information for an initial review. Submission does not create an engagement, guarantee a counterparty or imply endorsement of an opportunity."/></div><OpportunityForm/></div></section></>}
