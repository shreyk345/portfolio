---
title: "NeoCell UX Research and Review"
date: "2025-06-22"
tags: ["UX Research"]
# thumbnail: "/projects/bioluminescence/water1.avif"
description: "Conducting a user-experience evaluation on an e-commerce website."
featured: true
protected: true
problem: "Evaluate the user experience (UX) of NeoCell’s e-commerce website to understand how design choices influence user trust and friction in the purchase journey."
solution: "A list of actionable design insights with potential business applications to help optimise conversion rates."
prototypeUrl: "/projects/neocell/NeoCell_UX_Review.pdf"
duration: "Four days"
role: "UX Researcher"
---

## Background

In August 2025, I was tasked with evaluating the user experience (UX) of **NeoCell’s e-commerce website**, with a focus on the product detail page (PDP), mini-cart, cart page, and secondary site features. The audit was motivated by the need to understand how design choices influence **user trust and friction** in the purchase journey.

NeoCell, a collagen supplement brand, operates in a competitive digital market where **clarity, trust signals, and seamless checkout flows** are critical. By analyzing interaction patterns and benchmarking competitors (Vital Proteins, Garden of Life), this research identified key UX issues, especially on the PDP and cart, and proposed actionable design improvements with potential business applications in **optimising conversion rates**.

## Research Goals

This project aimed to address the following key questions:
- What factors create friction in NeoCell’s purchase journey?
- How can site design better communicate trust and product value?
- What design elements encourage higher cart completion and subscription sign-ups?

Research Questions:
- Are users able to access critical product details (ingredients, benefits, reviews) without effort?
- Is the checkout path intuitive and free of unnecessary barriers?
- How does NeoCell’s UX compare with competitor best practices?

Hypotheses & Expectations:
- Oversized visuals and redundant content may reduce clarity and push critical CTAs below the fold.
- Lack of sticky CTAs, trust marks, and upsell messaging likely decreases conversions.
- Competitors using trust badges, testimonials, and subscription prompts may achieve higher engagement.

## Methodologies

For this project, I chose to conduct research using a mix of **behavioral analytics and heuristic evaluation**:
- Tools Used: Microsoft Clarity (heatmaps, interaction tracking) for real-world behavioral data.
- UX Audit: Heuristic review of PDP, mini-cart, cart, and secondary flows.
- Competitor Benchmarking: Evaluated UX strategies from Vital Proteins, Garden of Life, and Nature’s Bounty to contextualize gaps.

I chose to use behavioural analytics and heuristic evaluation due to the time-sensitive nature of this project, keeping time and budget constraints in mind. My supervisor helped me choose these methods to balance quantitative insights (click-through rates, rage clicks, scroll depth) with qualitative heuristics (clarity, trust-building, accessibility), thus ensuring, to the best of my ability, both user behavior and best practices were considered.

## Key Learnings 

I spent time analysing the site, first by conducting a heuristic review where I looked as an objective user for friction and pain points, checked out the PDP and cart pages and created an account as a customer to analyse the account section as well. I then looked at clickmaps, attention maps and session replays for both desktop and mobile, making sure to filter for US-local sessions as well as international sessions as well, to get a good balance of data.

Some of the insights I summarised:

### Product Detail Page (PDP)

- Hero image is oversized, pushing CTAs far below the fold
    - According to the attention map, very few users were retained at the first CTA
    - There are also miscellaneous items like the NeoCell logo and an oversized banner above-the-fold, which occupy a lot of unecessary screen space.
- Content sections (ingredients, usage) are hidden in accordions, risking missed information.
    - Accordions specifically show high amounts of activity according to heatmaps, and certain sections could be auto-expanded to be read more easily.
- Lack of trust badges, certifications, and testimonials weaken site credibility compared to some of the competitors.

### Mini-Cart

- Thumbnail images are too small and low quality, reducing product reassurance.
- “Proceed to Checkout” button shows minimal engagement.
- No subscription upsells or dynamic free shipping messages — both present in competitor flows.

Data collected from the mini- cart shows very minimal engagement with the mini-cart from consumers. There are also several smaller issues to note:
- The yellow progress bar for free shipping looks like a static element rather than a dynamic, change-reflecting design.
- The "We also recommend" carousel cards look blocky, and include many unecessary design features like the pink bar across the top of the cards.
- Most importantly, the quantity selector is not automated. In order to increase or decrease the quantity, one has to manually add or remove items and then click update. This feature is an extreme friction inducing element on the page.

### Cart Page
- The cart page also retains redundant design elements- pink bars, non-automated update button and others.
- Missing quantity adjuster buttons lessens intuitivity of page (have to click on the quantity, type in the number, and click "Update shopping cart" to adjust)
- Clicking on the "Edit" icon (pencil) on cart page leads back to PDP.
- No clear “subscribe & save” comparison messaging, unlike competitors.

### Secondary Pages (Homepage, Collections, Login)
- Homepage lacks trust marks and clear CTAs.
- Collection page filters are not sticky, and product cards have poor alignment.
- Account/login still opens in a new tab, breaking flow.

## Recommendations

<table style="width:100%; border-collapse:collapse; margin:1.6em 0; font-family:Lato, sans-serif; font-size:15px">
  <thead>
    <tr style="border-bottom:2px solid #FE602F">
      <th style="text-align:left; padding:10px 16px; font-weight:700; width:50%">Area</th>
      <th style="text-align:left; padding:10px 16px; font-weight:700; width:50%">Potential Solutions</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid rgba(128,128,128,0.2)">
      <td style="padding:14px 16px; font-weight:700; vertical-align:top">PDP</td>
      <td style="padding:14px 16px; vertical-align:top">
        <ul style="margin:0; padding-left:1.2em">
          <li>Reduce hero image size and redundant text.</li>
          <li>Add sticky Add to Cart CTA.</li>
          <li>Auto-expand ingredients/usage details.</li>
          <li>Add trust badges, certifications, testimonials.</li>
          <li>Explore bundles or comparison charts.</li>
        </ul>
      </td>
    </tr>
    <tr style="border-bottom:1px solid rgba(128,128,128,0.2)">
      <td style="padding:14px 16px; font-weight:700; vertical-align:top">Mini-Cart</td>
      <td style="padding:14px 16px; vertical-align:top">
        <ul style="margin:0; padding-left:1.2em">
          <li>Improve product image quality and size.</li>
          <li>Add subscription toggle + free shipping messaging.</li>
          <li>Rename header to "Item Added to Cart."</li>
          <li>Add undo/remove option.</li>
          <li>Integrate cross-sell/upsell recommendations.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="padding:14px 16px; font-weight:700; vertical-align:top">Cart Page</td>
      <td style="padding:14px 16px; vertical-align:top">
        <ul style="margin:0; padding-left:1.2em">
          <li>Simplify design, remove pink bars &amp; "Update" button.</li>
          <li>Add inline editing with quantity steppers.</li>
          <li>Highlight subscription savings (e.g., "Save 20% when you subscribe").</li>
          <li>Add reassurance signals (guarantee icons).</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Reflections

- Understood the importance of sticky CTAs and how CTA visibility directly impacts engagement.
- Saw firsthand how missing trust signals (badges, testimonials, guarantees) can erode credibility, especially in health-related products.
- Realized that small UI details (like image quality, undo options, or inline editing) have an outsized impact on user confidence and reducing friction.
- Noticed how competitor benchmarking reveals design patterns that influence industry standards, and how adopting them can close competitive gaps.

While I don't have the exact numbers on how my findings influenced the conversion rate, this project helped me understand the fundamentals of UX research in a way I hadn't had the opportunity to do before.