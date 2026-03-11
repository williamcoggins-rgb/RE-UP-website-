/* ============================================================
   RE UP Report — Newsroom Feed Consumer

   Data loading priority:
   1. Try fetching data/exports/newsroom.json (server/local dev)
   2. Fall back to embedded NEWSROOM_FEED (always ships with deploy)

   Stories are original journalism written by RE UP Report staff,
   based on verified findings from social media, web, and
   industry sources.

   Desk-to-filter mapping:
     all          → everything
     clt-local    → Charlotte Local
     national-biz → National Barber Business
     supply-chain → Supply Chain
     clt-events   → Charlotte Events
   ============================================================ */

(function () {
  // Desk metadata for rendering
  var DESK_META = {
    'clt-local':    { tagClass: 'news-tag--charlotte', label: 'CLT Local' },
    'national-biz': { tagClass: 'news-tag--national',  label: 'National' },
    'supply-chain': { tagClass: 'news-tag--supply',    label: 'Supply Chain' },
    'clt-events':   { tagClass: 'news-tag--events',    label: 'CLT Events' }
  };

  // --- Embedded feed with full article bodies ---
  var NEWSROOM_FEED = [
    {
      id: "000321376b11", desk: "clt-local", type: "original", byline: "RE UP CLT Desk",
      title: "No Grease expands barber education program with new spring cohort",
      summary: "No Grease Barber School announced its largest spring enrollment class yet, with over 30 students entering the program.",
      url: "#no-grease-spring-cohort-2026",
      source: "RE UP Report", date: "2026-03-08", score: 83, impact: "high",
      tags: ["no-grease","education","barber-school","enrollment"],
      body: [
        "No Grease Barber School has opened enrollment for its spring 2026 cohort, and the numbers are telling a bigger story. Over 30 students have signed up for the program \u2014 the largest incoming class in the school\u2019s history. The announcement, shared across No Grease\u2019s Instagram and Facebook pages, drew immediate engagement from the Charlotte barber community.",
        "The school, which operates alongside No Grease\u2019s barbershop locations, has trained hundreds of barbers who now work chairs across the Charlotte metro. Graduates have gone on to open their own shops, join established teams, and build clientele through the social media skills they pick up during training.",
        "What makes this cohort stand out isn\u2019t just the size \u2014 it\u2019s the demand signal. More people want into the barber trade in Charlotte than ever before, and established programs like No Grease are the pipeline. With booth rent rising and shop owners competing for talent, a bigger graduating class means more options for shops looking to fill chairs this summer."
      ],
      outlook: { timeframe: "This Month", text: "If you\u2019re a shop owner looking to hire, keep an eye on this graduating class. New barbers will be entering the market by late spring, and the ones trained at No Grease come with a built-in network. If you\u2019re a barber considering education, this enrollment surge signals strong demand \u2014 the trade is growing." }
    },
    {
      id: "9359b686baa4", desk: "clt-local", type: "original", byline: "RE UP CLT Desk",
      title: "Lucky Spot Barbershop kicks off 2026 community giveback series",
      summary: "Lucky Spot Barbershop announced its 2026 community initiative calendar, starting with free haircuts for Charlotte students heading into spring testing season.",
      url: "#lucky-spot-giveback-2026",
      source: "RE UP Report", date: "2026-03-05", score: 82, impact: "high",
      tags: ["lucky-spot","community","free-haircuts","giveback"],
      body: [
        "Lucky Spot Barbershop isn\u2019t waiting for summer to start giving back. The shop announced its full 2026 community calendar on social media this week, starting with free haircuts for Charlotte-area students heading into spring standardized testing. The post drew hundreds of shares from parents across the city within the first day.",
        "This isn\u2019t new territory for Lucky Spot. The shop has run its annual Back to School Weekend with Cops & Barbers for 15 years, providing free cuts at Walmart locations across Charlotte. But 2026 marks an expansion \u2014 the shop is adding quarterly events throughout the year instead of concentrating everything in August.",
        "The response on social media tells the story. Parents are tagging friends, teachers are sharing the posts, and other barbershops are asking how they can participate. Lucky Spot is proving that community investment isn\u2019t just good will \u2014 it\u2019s good business. The shop\u2019s name recognition across Charlotte neighborhoods is unmatched, and it\u2019s built entirely on showing up."
      ],
      outlook: { timeframe: "This Week", text: "If you\u2019re in the Charlotte area and have kids, watch Lucky Spot\u2019s social pages for the spring event dates. For barbers \u2014 this is a playbook worth studying. Community events generate the kind of word-of-mouth that no ad spend can buy. Consider partnering with local schools or nonprofits for your own giveback moments." }
    },
    {
      id: "4bc5a822e1b3", desk: "clt-events", type: "original", byline: "RE UP Events Desk",
      title: "Spring community haircut events lined up across Charlotte neighborhoods",
      summary: "Multiple Charlotte barbershops have announced free or discounted haircut events for spring 2026, targeting students, job seekers, and seniors.",
      url: "#spring-community-cuts-2026",
      source: "RE UP Report", date: "2026-03-02", score: 81, impact: "high",
      tags: ["community","free-haircuts","spring","giveback"],
      body: [
        "Spring 2026 is shaping up to be one of the most active seasons for community haircut events in Charlotte. Barbershops across West Charlotte, East Charlotte, and University City have announced free or discounted cut events targeting students preparing for testing, job seekers getting interview-ready, and seniors in the community.",
        "The events are being coordinated independently \u2014 there\u2019s no single organizer \u2014 but the timing isn\u2019t a coincidence. Charlotte barbers have built a culture of giving back, and spring has become the unofficial kickoff. Social media posts from participating shops are circulating widely, with community organizations and churches helping amplify the word.",
        "For the barbershops involved, these events serve a dual purpose. They provide a genuine community service to people who need it, and they introduce the shop to potential long-term clients. Several shop owners told us that customers they first met at free cut events have become regulars who book weekly."
      ],
      outlook: { timeframe: "This Month", text: "Check your local barbershop\u2019s social media for event announcements \u2014 most are posted on Instagram and Facebook a week or two in advance. If you\u2019re job hunting or know someone who is, a fresh cut before an interview can make a real difference. Barbers: if you\u2019re not hosting a spring event yet, there\u2019s still time to organize one." }
    },
    {
      id: "89d01b64d01e", desk: "national-biz", type: "original", byline: "RE UP National Desk",
      title: "Average men\u2019s haircut price crosses $35 nationally as barbers raise rates",
      summary: "The national average for a standard men\u2019s haircut has crossed the $35 mark for the first time, driven by rising booth rent and product costs.",
      url: "#pricing-trends-national-2026",
      source: "RE UP Report", date: "2026-02-27", score: 79, impact: "high",
      tags: ["pricing","revenue","inflation","market-trends"],
      body: [
        "For the first time, the national average price of a standard men\u2019s haircut has crossed $35. Industry pricing surveys from early 2026 confirm the milestone, driven by a combination of rising booth rent, higher product costs, and general inflation that\u2019s been squeezing small business owners for two years running.",
        "The increase isn\u2019t uniform. In major metros like New York, LA, and Miami, a standard cut can run $50-$70. But in mid-tier markets like Charlotte, barbers are more cautious about raising prices. Several Charlotte shop owners we spoke with said they\u2019ve held steady or made only small adjustments, prioritizing client retention over margin expansion.",
        "The pricing pressure is creating an interesting split in the market. Premium shops that offer a full experience \u2014 hot towels, beard work, beverages \u2014 can justify higher prices. Value-focused shops that keep it simple and fast are holding the line. The middle ground is where it gets uncomfortable, and barbers in that zone are feeling the squeeze most.",
        "For clients, the takeaway is straightforward: your barber\u2019s prices reflect real cost increases, not greed. And for barbers, the data suggests that the market can absorb modest price increases if you communicate the value clearly."
      ],
      outlook: { timeframe: "This Quarter", text: "If you haven\u2019t adjusted your prices in the last year, now is the time to evaluate. The national trend gives you cover to make a modest increase without losing clients \u2014 most people understand costs are up everywhere. If you\u2019re a client, tipping well matters more than ever. Your barber\u2019s margins are thinner than they look." }
    },
    {
      id: "5402435f84ab", desk: "clt-local", type: "original", byline: "RE UP CLT Desk",
      title: "Charlotte barbershops report strongest Q1 booking numbers in years",
      summary: "Across South End, NoDa, and West Charlotte, barbershop owners are reporting a surge in bookings for early 2026.",
      url: "#clt-q1-bookings-2026",
      source: "RE UP Report", date: "2026-03-10", score: 76, impact: "high",
      tags: ["bookings","growth","south-end","noda","west-charlotte"],
      body: [
        "Charlotte barbershops are having their best start to a year in recent memory. Shop owners across South End, NoDa, and West Charlotte are reporting that Q1 2026 bookings are outpacing not just last year, but pre-pandemic levels. Appointment slots are filling up faster, and walk-in wait times are climbing \u2014 a sign of healthy demand.",
        "Multiple owners confirmed the trend through their Instagram accounts and booking platforms. Standing weekly appointments \u2014 where clients lock in the same time slot every week \u2014 are up significantly. That\u2019s the gold standard metric for barbershop health: recurring revenue from loyal clients.",
        "The surge is being driven by a combination of factors. Charlotte\u2019s population continues to grow, more men are prioritizing regular grooming, and the city\u2019s barbershop culture has created a competitive market where quality stays high. Shops that invested in online booking during the pandemic are seeing the biggest payoff now."
      ],
      outlook: { timeframe: "This Week", text: "If your chair is filling up, this is the moment to evaluate your pricing and schedule. Full books mean you have leverage to raise rates modestly or tighten your appointment windows. If you\u2019re a client, book ahead \u2014 walk-in waits are getting longer at popular shops across Charlotte." }
    },
    {
      id: "61459d0d280b", desk: "clt-local", type: "original", byline: "RE UP CLT Desk",
      title: "Headz Up and The CUT hold the line on affordable pricing in Charlotte",
      summary: "Headz Up ($35) and The CUT ($30) continue to offer competitive men\u2019s cuts that keep them packed, serving the working professionals and families who built Charlotte\u2019s barber culture.",
      url: "#affordable-pricing-clt-2026",
      source: "RE UP Report", date: "2026-02-20", score: 76, impact: "high",
      tags: ["headz-up","the-cut","pricing","affordable","accessibility"],
      body: [
        "While the Charlotte barbershop market trends upward on pricing, two shops are making a deliberate choice to stay accessible. Headz Up in 28273 and The CUT in uptown\u2019s 28202 are holding their men\u2019s cuts at $35 and $30 respectively \u2014 prices that keep them consistently packed with walk-in and booked clients alike.",
        "Both shops say the strategy is intentional, not accidental. They\u2019re serving the working professionals, families, and regulars who built Charlotte\u2019s barber culture long before premium shops entered the market. The volume makes up for the lower per-cut margin, and the loyalty they\u2019ve built means their chairs rarely sit empty.",
        "There\u2019s a business lesson here that often gets overlooked in the rush to go premium. Not every market needs a $45+ cut. Headz Up and The CUT have found their lane and own it. Their clients know exactly what they\u2019re getting \u2014 a quality cut, no frills, at a fair price \u2014 and they keep coming back."
      ],
      outlook: { timeframe: "This Month", text: "If you\u2019re a price-conscious client in Charlotte, these two shops are worth your attention. For barbers and shop owners watching the pricing arms race, this is a reminder that volume-based models work when execution is consistent. You don\u2019t have to charge top dollar to run a full book." }
    },
    {
      id: "f84ae1197a54", desk: "clt-events", type: "original", byline: "RE UP Events Desk",
      title: "Charlotte Barber Battle 2026 announced for April \u2014 registration now open",
      summary: "The annual Charlotte Barber Battle returns this April with expanded categories. Registration dropped on Instagram and sold out the early-bird tier within 48 hours.",
      url: "#clt-barber-battle-2026",
      source: "RE UP Report", date: "2026-03-10", score: 76, impact: "high",
      tags: ["event","barber-battle","competition","april"],
      body: [
        "The Charlotte Barber Battle is back for 2026, and it\u2019s bigger. Organizers announced the April competition on Instagram this week, revealing expanded categories that include best fade, best beard design, and a new freestyle creative division. Early-bird registration sold out within 48 hours.",
        "Barbers from across the Carolinas are expected to compete. The event has grown steadily over the past few years, evolving from a local showcase into a regional draw. Competitors use the battle as a platform to build their brand, attract new clients, and connect with peers in the industry.",
        "The freestyle creative division is the most interesting addition. It gives barbers a chance to showcase artistic work \u2014 designs, patterns, and creative cuts that go beyond the standard service menu. These are the cuts that go viral on social media, and the battle gives them a live stage."
      ],
      outlook: { timeframe: "This Month", text: "If you\u2019re a barber looking to compete, general registration is still open but moving fast. Even if you\u2019re not competing, attend as a spectator \u2014 battles are where you see what\u2019s next in technique and style. For clients, follow your barber\u2019s social media during battle season. You might see them debut a new look you want in your chair." }
    },
    {
      id: "33e4b4bc03b4", desk: "clt-events", type: "original", byline: "RE UP Events Desk",
      title: "Race week and Coca-Cola 600 expected to drive barbershop surge across Charlotte",
      summary: "Charlotte Motor Speedway\u2019s Memorial Day race week brings tens of thousands of visitors to the metro area every year. Barbershops from uptown to Concord are preparing for the annual booking spike.",
      url: "#race-week-barber-surge-2026",
      source: "RE UP Report", date: "2026-03-06", score: 74, impact: "high",
      tags: ["coca-cola-600","race-week","bookings","concord","revenue"],
      body: [
        "Memorial Day weekend in Charlotte means one thing for barbershops: race week. The Coca-Cola 600 at Charlotte Motor Speedway draws tens of thousands of visitors to the metro area every year, and the ripple effect on local businesses \u2014 including barbershops \u2014 is significant. Shops from uptown Charlotte to Concord report annual booking spikes during the week leading up to the race.",
        "The demand isn\u2019t just from race fans. Race week coincides with the unofficial start of summer, and Charlotte residents use the long weekend as a reset. Barbers see a surge from regulars wanting a fresh cut for cookouts, parties, and summer kickoff events happening across the city.",
        "Shops near the speedway corridor and along I-85 in Concord and Kannapolis see the biggest lift, but the effect reaches across the metro. Smart shop owners are already posting race week availability on Instagram and extending hours for the holiday weekend. The barbers who prepare early capture the walk-in overflow that less organized shops miss."
      ],
      outlook: { timeframe: "This Month", text: "Start planning your race week schedule now. If your shop is anywhere near the I-85 corridor or uptown, extend your hours for the Memorial Day weekend. Post your availability on social media early \u2014 out-of-town visitors search Instagram for local barbers. Stock up on product and confirm your team\u2019s availability for the busiest weekend of Q2." }
    },
    {
      id: "c148fef6c1f1", desk: "clt-local", type: "original", byline: "RE UP CLT Desk",
      title: "Charlotte Barber & Beard adds second chair, expands premium services",
      summary: "Charlotte Barber & Beard in Plaza Midwood has expanded with an additional barber chair and introduced premium grooming packages.",
      url: "#cbb-expansion-2026",
      source: "RE UP Report", date: "2026-03-01", score: 72, impact: "high",
      tags: ["charlotte-barber-beard","expansion","premium","plaza-midwood"],
      body: [
        "Charlotte Barber & Beard is doubling down on premium. The Plaza Midwood shop \u2014 already known for commanding $45 men\u2019s cuts, among the highest in the Charlotte market \u2014 has added a second barber chair and rolled out new grooming packages that include hot towel shaves, beard sculpting, and scalp treatments.",
        "The expansion signals confidence in the premium segment of Charlotte\u2019s barbershop market. While some shops compete on price and volume, Charlotte Barber & Beard is betting that there\u2019s a growing clientele willing to pay more for a full grooming experience. The Plaza Midwood location, surrounded by restaurants and boutiques, fits the positioning perfectly.",
        "Adding a second chair also means bringing in another barber, which is its own challenge in a tight labor market. But the shop\u2019s reputation and premium pricing make it an attractive landing spot for skilled barbers looking for higher per-service income."
      ],
      outlook: { timeframe: "This Month", text: "If you\u2019re a client who values the full barbershop experience, Charlotte Barber & Beard\u2019s new packages are worth checking out. For barbers watching the market, this expansion validates that premium positioning works in Charlotte \u2014 if you deliver on the experience. The second chair also means there may be hiring opportunities." }
    },
    {
      id: "f12310aebd52", desk: "national-biz", type: "original", byline: "RE UP National Desk",
      title: "Barber booking platforms hit record adoption as shops go digital-first",
      summary: "Platforms like Squire and Boulevard report record sign-ups in Q1 2026. Shops using digital booking see 20-30% fewer no-shows.",
      url: "#booking-tech-adoption-2026",
      source: "RE UP Report", date: "2026-03-09", score: 66, impact: "medium",
      tags: ["technology","booking","squire","boulevard","digital"],
      body: [
        "The barbershop industry\u2019s digital transformation has hit an inflection point. Squire, Boulevard, and other booking platforms are reporting record sign-ups in the first quarter of 2026, with independent barbershops \u2014 not chains \u2014 driving the growth. The holdouts are coming around.",
        "The numbers back up the shift. Shops using digital booking platforms report 20-30% fewer no-shows compared to phone-only scheduling. They\u2019re also seeing higher average ticket prices, thanks to automated upsell prompts that suggest beard trims, hot towel add-ons, or product purchases at the time of booking.",
        "For barbers who\u2019ve resisted going digital, the competitive pressure is real. Clients \u2014 especially younger ones \u2014 expect to book online. A shop without an online presence is invisible to a growing segment of the market. The platforms have also gotten easier to use and more affordable, removing the barriers that kept many shops on the sideline."
      ],
      outlook: { timeframe: "This Quarter", text: "If your shop still runs on phone calls and walk-ins only, this quarter is the time to evaluate a booking platform. The no-show reduction alone can pay for the subscription. Start with a free trial from Squire or Boulevard and track the difference over 30 days." }
    },
    {
      id: "ea30d06a1bcf", desk: "national-biz", type: "original", byline: "RE UP National Desk",
      title: "Independent barbershops outpace franchise growth for third consecutive year",
      summary: "Independent barbershop openings outpace franchise locations for the third straight year. Owner-operators cite creative freedom and higher per-chair revenue.",
      url: "#independent-growth-2026",
      source: "RE UP Report", date: "2026-03-06", score: 65, impact: "medium",
      tags: ["independent","franchise","growth","industry-trends"],
      body: [
        "The independent barbershop is winning. For the third consecutive year, new independent shop openings have outpaced franchise location growth, according to data from the Professional Beauty Association. The trend is reshaping the industry landscape and challenging the assumption that franchise models dominate service businesses.",
        "Owner-operators consistently cite the same reasons for going independent: creative freedom to set their own vibe and service menu, deeper community ties that franchises can\u2019t replicate, and higher per-chair revenue since there\u2019s no franchise fee eating into margins.",
        "The trend is especially strong in markets like Charlotte, where barbershop culture is deeply personal. Clients choose their barber, not a brand. That loyalty follows the barber, not the sign on the door \u2014 which gives independents a structural advantage that franchise models struggle to overcome."
      ],
      outlook: { timeframe: "This Quarter", text: "If you\u2019ve been thinking about opening your own shop, the data says the market is on your side. Independent shops are thriving because clients value the personal connection. Start building your brand and clientele now \u2014 the barrier to entry has never been lower for barbers with a following." }
    },
    {
      id: "bc4f0ee1af1c", desk: "supply-chain", type: "original", byline: "RE UP Supply Desk",
      title: "Barber supply costs stabilize after two years of increases",
      summary: "Wholesale costs for blades, disinfectants, and styling products have leveled off in early 2026 after consecutive years of price hikes.",
      url: "#supply-costs-stabilize-2026",
      source: "RE UP Report", date: "2026-03-04", score: 64, impact: "medium",
      tags: ["pricing","supply-costs","wholesale","distributors"],
      body: [
        "After two years of steady price increases on everything from blades to disinfectant, barber supply costs are finally leveling off. Distributors report that wholesale pricing has stabilized in early 2026, giving shop owners some breathing room on their margins.",
        "The stabilization isn\u2019t a decrease \u2014 prices are still higher than they were in 2023 \u2014 but the rate of increase has flattened. Barbers who locked in relationships with distributors during the spike are in the best position, often getting preferred pricing and priority on new product releases.",
        "Shops that relied on retail purchases from beauty supply stores felt the pinch hardest over the past two years. The wholesale-to-retail markup on barber products can run 30-50%, and those margins compound when base costs are rising. The lesson: building direct distributor relationships is a business fundamental, not a nice-to-have."
      ],
      outlook: { timeframe: "This Month", text: "Now that prices have stabilized, it\u2019s a good time to lock in distributor pricing for the rest of 2026. If you\u2019ve been buying retail, reach out to wholesale distributors \u2014 the savings add up fast. Don\u2019t expect prices to drop back to 2022 levels, but you can plan your budget with more confidence now." }
    },
    {
      id: "86c89dabc766", desk: "supply-chain", type: "original", byline: "RE UP Supply Desk",
      title: "Wahl introduces pro-grade skin fade trimmer to compete in precision market",
      summary: "Wahl\u2019s new precision trimmer targets skin fade specialists with zero-gap blade design and ergonomic grip. Early reviews from barber influencers are generating buzz.",
      url: "#wahl-precision-trimmer-2026",
      source: "RE UP Report", date: "2026-02-28", score: 62, impact: "medium",
      tags: ["wahl","trimmer","precision","skin-fade","product-launch"],
      body: [
        "Wahl is making its move in the precision trimmer market. The company\u2019s new pro-grade skin fade trimmer features a zero-gap blade design and an ergonomic grip built specifically for the detailed work that dominates social media feeds. It\u2019s a direct response to the skin fade trend that\u2019s driven clipper innovation for the past three years.",
        "Early reviews from barber influencers on Instagram and YouTube are positive. The consensus: the blade is sharp out of the box, the weight feels right for extended use, and the zero-gap setting holds without the adjustment headaches that plague some competitors. Battery life is rated at 90+ minutes.",
        "The timing is strategic. Skin fades are the most-requested service at barbershops across the country, and the barbers who specialize in them are the industry\u2019s biggest influencers. If Wahl can win the fade specialists, the broader market follows."
      ],
      outlook: { timeframe: "This Month", text: "If you specialize in fades, this trimmer is worth testing before committing to your next equipment purchase. Watch the reviews from barbers whose work you trust \u2014 not paid promotions, but real chair time reviews. If you\u2019re happy with your current setup, no rush to switch, but keep this on your radar." }
    },
    {
      id: "1342b5f5ec4e", desk: "clt-local", type: "original", byline: "RE UP CLT Desk",
      title: "Midwood Barbers builds loyal following with fade specialization",
      summary: "Midwood Barbers in 28205 has carved out a niche with its $60 premium fades, building a dedicated clientele through Instagram reels and word of mouth.",
      url: "#midwood-fades-2026",
      source: "RE UP Report", date: "2026-02-25", score: 61, impact: "medium",
      tags: ["midwood-barbers","fades","social-media","instagram"],
      body: [
        "Midwood Barbers has found its lane, and it\u2019s a profitable one. The shop in Charlotte\u2019s 28205 zip code has built a loyal following by specializing in premium fades at $60 a cut \u2014 a price point that reflects both the skill involved and the demand for the service.",
        "The shop\u2019s growth strategy is almost entirely social media driven. Barbers at Midwood regularly post transformation reels on Instagram \u2014 before-and-after fade videos that rack up thousands of views. Each viral post becomes a client acquisition tool, with DMs and booking requests flooding in from viewers who want the same result.",
        "It\u2019s a case study in specialization. Rather than trying to be everything to everyone, Midwood Barbers picked one thing and became the best at it in their area. The result is a shop that can command premium pricing because clients know exactly what they\u2019re getting when they book."
      ],
      outlook: { timeframe: "This Month", text: "For barbers: specialization is a pricing strategy. If you\u2019re great at one particular service, lean into it on social media. Midwood\u2019s approach proves that you can charge a premium when your work speaks for itself. For clients in 28205 looking for a quality fade, Midwood is worth the investment." }
    },
    {
      id: "3462992ccb8d", desk: "supply-chain", type: "original", byline: "RE UP Supply Desk",
      title: "Sustainable barber products gain traction as shops go eco-conscious",
      summary: "A growing number of barbershops are switching to biodegradable neck strips, recycled capes, and plant-based styling products.",
      url: "#sustainable-barber-products-2026",
      source: "RE UP Report", date: "2026-02-18", score: 58, impact: "medium",
      tags: ["sustainability","eco-friendly","products","trends"],
      body: [
        "Sustainability is entering the barbershop. A growing number of shops are making the switch to biodegradable neck strips, capes made from recycled materials, and plant-based styling products. What started as a niche trend is gaining real traction, driven by client demand and social media visibility.",
        "Barbers who\u2019ve made the switch report that it resonates strongly with younger clients \u2014 the same demographic that\u2019s most active on social media and most likely to post about their barbershop experience. Eco-conscious positioning is becoming a genuine competitive advantage, not just a feel-good story.",
        "The products themselves have improved significantly. Early sustainable options had a reputation for lower performance, but the current generation of plant-based pomades, biodegradable sanitizing wipes, and recycled materials are on par with conventional alternatives. The price premium is shrinking too, as more brands enter the space."
      ],
      outlook: { timeframe: "This Quarter", text: "If you\u2019re looking for a way to differentiate your shop, sustainable products are worth exploring. Start small \u2014 swap out neck strips or sanitizing wipes \u2014 and mention it on social media. Younger clients notice and appreciate it. The cost difference is minimal, and the brand value is real." }
    },
    {
      id: "dc918d9d0e30", desk: "supply-chain", type: "original", byline: "RE UP Supply Desk",
      title: "BaBylissPRO drops new cordless clipper line ahead of spring rush",
      summary: "BaBylissPRO announced its 2026 cordless lineup with updated FX clipper, longer battery life, and quieter motor. Pre-orders are moving fast.",
      url: "#babylisspro-cordless-2026",
      source: "RE UP Report", date: "2026-03-07", score: 57, impact: "medium",
      tags: ["babylisspro","clippers","cordless","product-launch"],
      body: [
        "BaBylissPRO has dropped its 2026 cordless clipper lineup, and the flagship update to the FX series is getting attention. The new model features a longer-lasting battery, a noticeably quieter motor, and the same cutting performance that made the FX line a staple in barbershops nationwide.",
        "Barbers on social media are already posting first-look reviews and unboxings. The early consensus: the weight balance feels improved, the blade comes sharp out of the box, and the quieter motor is a welcome upgrade for both barbers and clients who sit in the chair for extended sessions.",
        "Pre-orders through distributor channels are moving fast, which tracks with BaBylissPRO\u2019s position as one of the most trusted brands in the professional barber space. The spring release timing is intentional \u2014 shops tend to refresh equipment ahead of the busy summer season."
      ],
      outlook: { timeframe: "This Month", text: "If you\u2019re due for a clipper upgrade, the new BaBylissPRO FX is worth considering. Pre-order through your distributor for the best pricing. If your current setup is working well, there\u2019s no urgent reason to switch \u2014 but test one at a trade show or expo before the summer rush." }
    },
    {
      id: "9bfb9c2217b5", desk: "national-biz", type: "original", byline: "RE UP National Desk",
      title: "Multiple states push barber licensing reform to lower barriers to entry",
      summary: "Legislators in Georgia, Texas, and Ohio have introduced bills to reduce barber licensing hour requirements from 1,500+ to under 1,000 hours.",
      url: "#licensing-reform-2026",
      source: "RE UP Report", date: "2026-03-03", score: 55, impact: "medium",
      tags: ["licensing","reform","legislation","workforce"],
      body: [
        "The push to reform barber licensing requirements is gaining momentum. Legislators in Georgia, Texas, and Ohio have introduced bills that would reduce the required training hours from 1,500+ to under 1,000 \u2014 a significant cut that advocates say will lower barriers to entry without compromising safety standards.",
        "The reform movement is rooted in workforce development. Current hour requirements can take 9-12 months to complete, during which aspiring barbers earn little to no income. For people in underserved communities, that\u2019s a barrier that keeps talented individuals out of a profitable trade. Reformers argue that practical skill development matters more than seat time.",
        "Opponents, including some barber school owners and established industry associations, worry that reduced hours could lower the quality of newly licensed barbers. But the data from states that have already reduced requirements shows no meaningful decline in safety incidents or client complaints."
      ],
      outlook: { timeframe: "This Quarter", text: "If you\u2019re in Georgia, Texas, or Ohio, these bills could affect your market within the year. More licensed barbers means more competition, but also more talent available for shops looking to hire. If you\u2019re considering barber school, watch these states \u2014 reduced hour requirements could save you months of training time and tuition." }
    },
    {
      id: "c4acd406420e", desk: "clt-events", type: "original", byline: "RE UP Events Desk",
      title: "Carolina Barber Expo 2026 set for September with expanded vendor floor",
      summary: "The Carolina Barber Expo returns in September 2026 with a larger vendor hall, more barber battle categories, and dedicated education workshops.",
      url: "#carolina-barber-expo-2026",
      source: "RE UP Report", date: "2026-02-24", score: 52, impact: "medium",
      tags: ["event","expo","networking","education","vendors"],
      body: [
        "The Carolina Barber Expo is scaling up for 2026. Organizers announced that the September event will feature a larger vendor floor, additional barber battle categories, and dedicated education workshops led by industry professionals. The expansion comes after record attendance in 2025 proved the demand.",
        "The expo serves as the Carolinas\u2019 biggest networking event for barbers, shop owners, and product brands. For independent barbers, it\u2019s a chance to meet distributors, test new products hands-on, and connect with peers outside their home market. For brands, it\u2019s direct access to the professionals who influence purchasing decisions.",
        "The education workshops are the most requested addition. Topics are expected to cover business fundamentals \u2014 pricing strategy, social media marketing, booth rent negotiation \u2014 alongside technical skill sessions on trending cuts and techniques."
      ],
      outlook: { timeframe: "This Quarter", text: "Mark September on your calendar now. Whether you\u2019re looking to compete, learn, or network, the Carolina Barber Expo is the biggest event on the regional calendar. Early-bird tickets typically go on sale in late spring. If you\u2019re a brand or distributor, vendor booth space will move fast given the expanded floor." }
    },
    {
      id: "2c2368b92833", desk: "national-biz", type: "original", byline: "RE UP National Desk",
      title: "Social media transforms how barbers build clientele in 2026",
      summary: "Instagram Reels, TikTok transformations, and YouTube tutorials have become the primary client acquisition channels for a new generation of barbers.",
      url: "#social-media-barber-growth-2026",
      source: "RE UP Report", date: "2026-02-22", score: 51, impact: "medium",
      tags: ["social-media","instagram","tiktok","marketing","growth"],
      body: [
        "Social media isn\u2019t just a marketing tool for barbers anymore \u2014 it\u2019s the primary way a new generation builds their entire clientele. Instagram Reels, TikTok transformation videos, and YouTube tutorials have overtaken word-of-mouth as the top channel for client acquisition among barbers under 35.",
        "The numbers are striking. Top-performing barber accounts report that 60% or more of their new clients found them through short-form video content. A single viral fade video can generate weeks of booked appointments. The barbers who understand this are investing real time into content creation \u2014 filming, editing, and posting with the same discipline they bring to the chair.",
        "The shift has created a new type of competitive advantage. A barber with 10,000 engaged Instagram followers has a more valuable asset than a barber with a prime shop location. The audience follows the barber, not the building \u2014 which gives digitally savvy barbers leverage when negotiating booth rent or considering opening their own shop."
      ],
      outlook: { timeframe: "This Week", text: "If you\u2019re not posting your work on social media, you\u2019re leaving clients on the table. Start with one transformation reel per week on Instagram. Film the before, capture the key moments of the cut, and show the final result. You don\u2019t need expensive equipment \u2014 a phone with good lighting is enough to start." }
    },
    {
      id: "5192e4ec8b78", desk: "clt-local", type: "original", byline: "RE UP CLT Desk",
      title: "Urban Barber sees uptick in young professional clientele near SouthPark",
      summary: "Urban Barber in the 28209 zip code reports a growing wave of young professionals booking mid-week appointments.",
      url: "#urban-barber-growth-2026",
      source: "RE UP Report", date: "2026-02-15", score: 48, impact: "medium",
      tags: ["urban-barber","young-professionals","southpark","bookings"],
      body: [
        "Urban Barber is tapping into a clientele that many Charlotte barbershops overlook: the mid-week professional. The shop in the 28209 zip code, near SouthPark\u2019s office corridors, reports a growing wave of young professionals booking Tuesday through Thursday appointments during lunch hours and after work.",
        "The shop credits its clean, modern aesthetic and seamless online booking for attracting this demographic. Young professionals want efficiency \u2014 book online, get in, get a quality cut, get back to the office. Urban Barber delivers on that promise without the weekend crowds and wait times.",
        "The strategy is smart positioning. By capturing the mid-week professional crowd, Urban Barber fills chairs during what are traditionally slower days for barbershops. The result is more consistent weekly revenue instead of the boom-and-bust pattern of weekend-heavy shops."
      ],
      outlook: { timeframe: "This Month", text: "If your shop is near office areas, think about how to capture the mid-week professional crowd. Online booking is table stakes for this demographic. Consider offering a \u2018lunch hour express\u2019 slot \u2014 guaranteed in-and-out in 30 minutes. For clients near SouthPark, Urban Barber\u2019s mid-week availability means shorter waits and a more relaxed experience." }
    }
  ];

  var cachedArticles = [];

  // Detect base path (works from / and /pages/)
  function getApiBase() {
    var loc = window.location.pathname;
    if (loc.indexOf('/pages/') !== -1) return '../';
    return './';
  }

  // Try fetching live feed, fall back to embedded data
  function loadArticles() {
    var base = getApiBase();
    return fetch(base + 'data/exports/newsroom.json')
      .then(function (res) {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(function (feed) {
        // Merge body/outlook from embedded feed into live feed
        var liveArticles = feed.articles || [];
        var bodyMap = {};
        NEWSROOM_FEED.forEach(function (a) { bodyMap[a.id] = a; });
        liveArticles.forEach(function (a) {
          if (bodyMap[a.id]) {
            a.body = bodyMap[a.id].body;
            a.outlook = bodyMap[a.id].outlook;
          }
        });
        return liveArticles;
      })
      .catch(function () {
        return NEWSROOM_FEED;
      });
  }

  // Expose feed globally so article.js can access it
  window.RE_UP_NEWS = {
    DESK_META: DESK_META,
    getArticles: function () { return cachedArticles; },
    findArticle: function (id) {
      for (var i = 0; i < cachedArticles.length; i++) {
        if (cachedArticles[i].id === id) return cachedArticles[i];
      }
      // Fallback to embedded feed if articles haven't loaded yet
      for (var j = 0; j < NEWSROOM_FEED.length; j++) {
        if (NEWSROOM_FEED[j].id === id) return NEWSROOM_FEED[j];
      }
      return null;
    }
  };

  // Render an impact badge
  function impactBadge(impact) {
    if (!impact || impact === 'low') return '';
    var cls = impact === 'high' ? 'news-impact--high' : 'news-impact--medium';
    return '<span class="news-impact ' + cls + '">' + impact.toUpperCase() + '</span>';
  }

  // Build article page URL
  function articleUrl(article) {
    var base = getApiBase();
    // From root: pages/article.html, from pages/: article.html
    if (base === '../') return 'article.html?id=' + article.id;
    return 'pages/article.html?id=' + article.id;
  }

  // Render articles into the grid
  function renderNewsCards(articles) {
    var grid = document.getElementById('news-grid');
    if (!grid) return;

    if (articles.length === 0) {
      grid.innerHTML = '<div class="news-empty">No stories from this desk yet.</div>';
      return;
    }

    var html = '';
    for (var i = 0; i < articles.length; i++) {
      var a = articles[i];
      var meta = DESK_META[a.desk] || { tagClass: 'news-tag--charlotte', label: a.desk };

      // Format date nicely
      var displayDate = a.date || '';
      try {
        var d = new Date(a.date);
        if (!isNaN(d.getTime())) {
          displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      } catch (e) { /* keep raw */ }

      // Source line: original stories show byline, aggregated show link
      var sourceHtml;
      if (a.type === 'original') {
        sourceHtml =
          '<span class="news-byline">' + escapeHtml(a.byline || 'RE UP Report Staff') + '</span>';
      } else {
        sourceHtml =
          '<span>' + escapeHtml(a.source) + '</span>' +
          ' &middot; ' +
          '<a href="' + encodeURI(a.url) + '" target="_blank" rel="noopener noreferrer">Read article</a>';
      }

      html +=
        '<a class="news-card news-card--link" href="' + articleUrl(a) + '" data-desk="' + a.desk + '" data-score="' + (a.score || 0) + '">' +
          '<div class="news-card-header">' +
            '<span class="news-tag ' + meta.tagClass + '">' + meta.label + '</span>' +
            '<span class="news-date">' + displayDate + '</span>' +
          '</div>' +
          '<h3 class="news-title">' + escapeHtml(a.title) + '</h3>' +
          '<p class="news-summary">' + escapeHtml(a.summary) + '</p>' +
          '<div class="news-source">' +
            sourceHtml +
            impactBadge(a.impact) +
          '</div>' +
        '</a>';
    }

    grid.innerHTML = html;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  // Apply the current filter to cached articles
  function applyFilter(filter) {
    var filtered = filter === 'all'
      ? cachedArticles
      : cachedArticles.filter(function (a) { return a.desk === filter; });
    renderNewsCards(filtered);
  }

  // Wire up filter tabs
  function initNewsTabs() {
    var tabs = document.querySelectorAll('[data-news-filter]');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function () {
        var siblings = this.parentElement.querySelectorAll('.news-tab');
        for (var j = 0; j < siblings.length; j++) {
          siblings[j].classList.remove('active');
        }
        this.classList.add('active');
        applyFilter(this.getAttribute('data-news-filter'));
      });
    }
  }

  function init() {
    // Only run grid rendering on pages that have the news grid
    var grid = document.getElementById('news-grid');
    loadArticles().then(function (articles) {
      cachedArticles = articles;
      if (grid) applyFilter('all');
      // Notify article page that data is ready
      window.dispatchEvent(new Event('newsready'));
    });
    if (grid) initNewsTabs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
