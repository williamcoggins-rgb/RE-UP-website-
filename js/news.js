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
      outlook: {
        timeframe: "This Month",
        summary: "No Grease Barber School enrolled its largest spring class ever with 30+ students, signaling surging demand for barber training in Charlotte.",
        impact: "A bigger graduating class floods the local talent market by late spring. Shop owners gain more hiring options, but new barbers also mean more competition for walk-in clients and booth-rental spots across the metro.",
        actions: [
          "If you are hiring, contact No Grease now to get early introductions to graduating students before they commit elsewhere.",
          "Review your booth-rental or commission structure so your offer is competitive when new talent starts shopping chairs.",
          "If you are considering barber school yourself, the enrollment surge confirms strong demand — apply before cohorts fill."
        ],
        watchFor: "Watch for the spring graduation date announcement on No Grease social media. That is when 30+ new barbers enter the Charlotte market simultaneously."
      }
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
      outlook: {
        timeframe: "This Week",
        summary: "Lucky Spot Barbershop launched its 2026 community calendar with free student haircuts, expanding from a single annual event to quarterly givebacks.",
        impact: "Community givebacks generate organic word-of-mouth that outperforms paid advertising. Lucky Spot's 15-year track record shows this model builds lasting name recognition across neighborhoods.",
        actions: [
          "Follow Lucky Spot's social pages to catch spring event dates if you have kids who need a free cut before testing season.",
          "Partner with a local school or nonprofit to host your own giveback event — even a single Saturday morning builds community trust.",
          "Document your event on social media with photos and client testimonials to maximize the long-tail marketing value."
        ],
        watchFor: "Monitor Lucky Spot's quarterly event announcements as a benchmark for community engagement in Charlotte's barber scene."
      }
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
      outlook: {
        timeframe: "This Month",
        summary: "Multiple Charlotte barbershops across West Charlotte, East Charlotte, and University City announced free or discounted spring haircut events for students, job seekers, and seniors.",
        impact: "The coordinated spring giveback season shows Charlotte's barber culture is maturing. Shops that participate gain long-term regulars — several owners report that free-event clients convert to paying weekly customers.",
        actions: [
          "If you are job hunting, look for free cut events on Instagram and Facebook — a fresh cut before an interview makes a measurable difference.",
          "Organize your own spring event now — there is still time to coordinate with a local church or community center for a Saturday session.",
          "Track which shops in your area are hosting events and consider a joint event to split costs and amplify reach."
        ],
        watchFor: "Watch community organization pages and church bulletins for event listings that may not appear on barbershop social media."
      }
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
      outlook: {
        timeframe: "This Quarter",
        summary: "The national average men's haircut price crossed $35 for the first time, driven by rising booth rent and product costs across the industry.",
        impact: "Charlotte's market sits in an interesting position — premium shops charge $45-65 while value shops hold at $20-35. The national trend gives Charlotte barbers who have not raised prices in 12+ months clear justification for a modest increase.",
        actions: [
          "Audit your pricing against Charlotte zip code averages — if you are more than $5 below your area average, a $3-5 increase is well within market tolerance.",
          "Communicate any price change to clients two weeks in advance via social media and in-shop signage to minimize surprise and churn.",
          "If you choose not to raise prices, tighten your schedule to reduce gaps and increase daily volume to protect your income."
        ],
        watchFor: "Track whether Charlotte shops follow the national trend with Q2 price increases. A city-wide move gives you even more cover for your own adjustment."
      }
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
      outlook: {
        timeframe: "This Week",
        summary: "Charlotte barbershops in South End, NoDa, and West Charlotte reported their strongest Q1 booking numbers in years, outpacing pre-pandemic levels.",
        impact: "Full books signal pricing power. When appointments are filling consistently, you are underpriced or under-scheduled. Standing weekly bookings — the gold standard metric — are up significantly across multiple neighborhoods.",
        actions: [
          "If your chair is consistently full, test a $3-5 price increase this month — demand is strong enough to absorb it.",
          "Tighten your appointment windows by 5-10 minutes if you can maintain quality — one extra client per day compounds to significant revenue.",
          "Clients: book your regular slot now as a standing appointment before your barber's calendar locks up for spring."
        ],
        watchFor: "Monitor whether Q1 momentum carries into Q2. If bookings stay strong through April, a summer price adjustment is well-supported by demand."
      }
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
      outlook: {
        timeframe: "This Month",
        summary: "Headz Up ($35 in 28273) and The CUT ($30 in 28202) are holding affordable pricing while staying consistently packed, proving the volume model works.",
        impact: "In a market trending toward premium pricing, these shops demonstrate that high-volume, fair-price models still generate strong revenue when execution is consistent. Their full books show there is a large underserved market of price-conscious clients.",
        actions: [
          "If you run a value-focused shop, study Headz Up and The CUT's operations — their efficiency and consistency are what make the model work.",
          "Consider offering a 'core cut' at a competitive price while adding premium add-ons (beard work, hot towel) to capture additional revenue per visit.",
          "Price-conscious clients: check both shops' availability this week — they stay busy, so booking ahead is essential."
        ],
        watchFor: "Watch whether these shops adjust pricing as the national average continues climbing. If they hold steady, their competitive moat deepens."
      }
    },
    {
      id: "32081e0d602e", desk: "clt-events", type: "original", byline: "RE UP Events Desk",
      title: "ACC Tournament fills Spectrum Center this week \u2014 barbers near uptown prepare for surge",
      summary: "The ACC Men\u2019s Basketball Tournament runs March 10-14 at Spectrum Center in uptown Charlotte, bringing thousands of fans and alumni to the city.",
      url: "#acc-tournament-barber-surge-2026",
      source: "RE UP Report", date: "2026-03-09", score: 75, impact: "high",
      tags: ["acc-tournament","spectrum-center","uptown","bookings","revenue"],
      body: [
        "The ACC Men\u2019s Basketball Tournament is back at Spectrum Center this week, running March 10-14 in uptown Charlotte. Thousands of fans, alumni, and media from across the conference\u2019s footprint are descending on the city \u2014 and barbershops within a few miles of uptown are already feeling the effect.",
        "Tournament weeks are reliable revenue drivers for Charlotte barbers. Visitors want to look sharp for games, watch parties, and the social events that surround the tournament. Shops in uptown, South End, and NoDa report that walk-in traffic spikes noticeably during multi-day events at Spectrum Center.",
        "The smart play for barbers this week: post your location and availability on Instagram and Google. Out-of-town visitors search for \u2018barber near me\u2019 when they arrive, and the shops that show up first capture the walk-in business. Extended evening hours also help catch fans looking for a cut between games."
      ],
      outlook: {
        timeframe: "This Week",
        summary: "The ACC Men's Basketball Tournament runs March 10-14 at Spectrum Center, bringing thousands of fans and alumni to uptown Charlotte.",
        impact: "Multi-day sporting events reliably spike walk-in traffic at shops within a few miles of the venue. Tournament visitors search 'barber near me' on arrival and are willing to pay premium prices for convenience.",
        actions: [
          "Post your work and shop location on Instagram and Google daily this week — tournament visitors are actively searching for local barbers.",
          "Extend your hours through Friday evening to capture fans looking for cuts between games and evening events.",
          "Offer a 'Tournament Special' bundle (cut + beard trim) to increase average ticket on walk-in visitors you may only see once."
        ],
        watchFor: "Track your walk-in volume and average ticket this week as a baseline for the next major Spectrum Center event."
      }
    },
    {
      id: "79c2c1a486eb", desk: "clt-events", type: "original", byline: "RE UP Events Desk",
      title: "Charlotte SHOUT! festival kicks off April 3 \u2014 uptown foot traffic expected to spike",
      summary: "Charlotte SHOUT!, the city\u2019s major uptown arts and culture festival, runs April 3-19 with installations, live performances, and block parties.",
      url: "#charlotte-shout-2026",
      source: "RE UP Report", date: "2026-03-07", score: 74, impact: "high",
      tags: ["charlotte-shout","festival","uptown","foot-traffic","april"],
      body: [
        "Charlotte SHOUT! returns April 3-19 with two-plus weeks of art installations, live performances, and block parties across uptown. The festival, which has grown into one of the city\u2019s signature cultural events, brings consistent foot traffic to the center city area throughout its run.",
        "For barbershops near uptown and South End, SHOUT! is a sustained traffic boost rather than a single-day spike. Festival-goers explore the area on foot, and the evening events create demand for fresh cuts from people heading out to performances and parties. Shops that stay open later during SHOUT! capture clients they\u2019d otherwise miss.",
        "The festival also presents a branding opportunity. Some shops have set up pop-up chairs at past SHOUT! events, offering quick trims and building name recognition with a festival audience that skews young and social-media active."
      ],
      outlook: {
        timeframe: "This Month",
        summary: "Charlotte SHOUT! returns April 3-19 with two weeks of art installations, live performances, and block parties across uptown.",
        impact: "Unlike single-day events, SHOUT! creates sustained foot traffic over 17 days. Evening events drive demand for fresh cuts from people heading to performances and parties, especially from the young, social-media-active demographic.",
        actions: [
          "Block April 3-19 on your calendar and extend evening hours on event nights — capture clients heading out to SHOUT! performances.",
          "Contact SHOUT! organizers about a pop-up chair or vendor booth at the festival to build name recognition with a new audience.",
          "Post festival-related content on your social media to align your brand with the cultural moment and attract the SHOUT! audience."
        ],
        watchFor: "Watch the SHOUT! event schedule for the biggest nights and plan your extended hours around peak attendance dates."
      }
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
      outlook: {
        timeframe: "This Month",
        summary: "The Coca-Cola 600 and Memorial Day race week at Charlotte Motor Speedway bring tens of thousands of visitors to the metro, spiking barbershop demand from uptown to Concord.",
        impact: "Race week is the single biggest booking surge of Q2. Shops along the I-85 corridor and near uptown see walk-in overflow that less-prepared shops miss entirely. The long weekend also triggers summer kickoff demand from locals.",
        actions: [
          "Confirm your full team's availability for Memorial Day weekend now — do not wait until May to lock in schedules.",
          "Post race week availability on Instagram early so out-of-town visitors find you when searching for Charlotte barbers.",
          "Stock up on product and supplies by mid-May to avoid last-minute distributor delays during the holiday weekend."
        ],
        watchFor: "Track race week revenue as a benchmark. If it exceeds a normal week by 30%+, plan for similar prep around the Charlotte FC All-Star Game."
      }
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
      outlook: {
        timeframe: "This Month",
        summary: "Charlotte Barber & Beard in Plaza Midwood added a second chair and launched premium grooming packages including hot towel shaves and scalp treatments at its $45 price point.",
        impact: "This expansion validates the premium segment in Charlotte. A shop adding capacity at $45/cut in Plaza Midwood signals that high-end demand is strong enough to justify investment. It also tightens the labor market for skilled barbers.",
        actions: [
          "If you are a skilled barber looking for higher per-service income, Charlotte Barber & Beard may be hiring for the new chair — reach out directly.",
          "Evaluate whether adding premium add-on packages (beard sculpting, scalp treatments) could increase your average ticket without raising your base price.",
          "Clients who want the full grooming experience should check out the new packages — premium positioning only works when the experience delivers."
        ],
        watchFor: "Watch whether other Plaza Midwood and NoDa shops follow with premium package launches. A cluster of premium shops could shift the area's pricing floor upward."
      }
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
      outlook: {
        timeframe: "This Quarter",
        summary: "Squire, Boulevard, and other booking platforms reported record Q1 sign-ups, with independent shops driving the growth and seeing 20-30% fewer no-shows.",
        impact: "Digital booking is no longer optional. Shops without online booking are invisible to younger clients who expect to book from their phone. The no-show reduction alone — 20-30% — covers the platform subscription cost within the first month.",
        actions: [
          "Start a free trial with Squire or Boulevard this week and track no-show rates, average ticket, and new client acquisition over 30 days.",
          "Enable automated upsell prompts at booking time — platforms report higher average tickets when beard trims and add-ons are suggested during scheduling.",
          "If you already use a booking platform, audit your profile — make sure photos, pricing, and availability are current to maximize conversion."
        ],
        watchFor: "Watch for platform pricing changes as adoption grows. Lock in current rates now before platforms raise prices with increased market power."
      }
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
      outlook: {
        timeframe: "This Quarter",
        summary: "Independent barbershop openings outpaced franchise locations for the third straight year, driven by creative freedom and higher per-chair revenue for owner-operators.",
        impact: "The independent model has a structural advantage in barbering — clients follow the barber, not the brand. In Charlotte, where barbershop culture is deeply personal, this trend is even more pronounced.",
        actions: [
          "If you are considering opening your own shop, start building your personal brand on social media now — a following of 2,000+ gives you a client base from day one.",
          "Research booth-rental and lease costs in your target neighborhood to understand the real startup costs before making the leap.",
          "If you are a shop owner, differentiate on culture and community — that is the advantage franchises cannot replicate."
        ],
        watchFor: "Track new shop openings in Charlotte over the next quarter. More independents entering the market means more competition but also more proof that the model works."
      }
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
      outlook: {
        timeframe: "This Month",
        summary: "Wholesale costs for blades, disinfectants, and styling products leveled off in early 2026 after two consecutive years of price increases.",
        impact: "Price stabilization means you can finally plan your supply budget with confidence. Shops that built distributor relationships during the spike are in the best position. If you have been buying retail, you are paying a 30-50% markup that directly eats your margin.",
        actions: [
          "Contact your distributor this week to lock in pricing for the rest of 2026 while rates are stable.",
          "If you buy retail, reach out to at least two wholesale distributors for quotes — the savings on a quarterly order can exceed $200.",
          "Audit your product usage and eliminate items with low sell-through or client demand to reduce carrying costs."
        ],
        watchFor: "Monitor raw material costs (steel for blades, petrochemicals for products) for early signals of a second wave of increases in late 2026."
      }
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
      outlook: {
        timeframe: "This Month",
        summary: "Wahl launched a new pro-grade skin fade trimmer with zero-gap blade design and 90+ minute battery, targeting the precision fade market dominated by competitors.",
        impact: "Skin fades are the most-requested service nationally. A new credible entry from Wahl increases competition among equipment brands, which benefits barbers through better products and potential price pressure on existing options.",
        actions: [
          "If you specialize in fades, request a demo unit from your Wahl distributor before committing to a purchase — test it on real clients.",
          "Watch reviews from barbers you trust (not paid promotions) who post real chair-time results over at least two weeks of use.",
          "If your current trimmer is working well, no rush to switch — but note the zero-gap spec for your next equipment purchase cycle."
        ],
        watchFor: "Watch how competing brands (BaBylissPRO, Andis) respond with their own precision trimmer updates. Competition drives better products for barbers."
      }
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
      outlook: {
        timeframe: "This Month",
        summary: "Midwood Barbers in 28205 built a dedicated clientele around $60 premium fades, using Instagram transformation reels as its primary growth channel.",
        impact: "Specialization is a pricing strategy. Midwood proves that owning one service category lets you command premium pricing because clients know exactly what they are getting. Each viral reel becomes a direct client acquisition tool.",
        actions: [
          "Identify your strongest service and lean into it on social media — post one transformation reel per week showing your best work in that category.",
          "If fades are your specialty, benchmark your pricing against Midwood's $60 rate and the 28205 area average of $38 to see if you are underpriced.",
          "Clients in the Plaza Midwood area: book Midwood Barbers for fades specifically — their specialization means higher consistency and quality."
        ],
        watchFor: "Watch Midwood's Instagram engagement rates for signals on which content formats drive the most bookings — replicate what works for your own specialization."
      }
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
      outlook: {
        timeframe: "This Quarter",
        summary: "More barbershops are switching to biodegradable neck strips, recycled capes, and plant-based styling products as eco-conscious positioning becomes a competitive advantage.",
        impact: "Sustainable products resonate strongest with younger clients — the same demographic most active on social media and most likely to post about their barbershop experience. The price premium is shrinking as more brands enter the space.",
        actions: [
          "Start small: swap out neck strips or sanitizing wipes for biodegradable alternatives and mention it on social media to test client response.",
          "Add a visible 'eco-conscious shop' indicator to your booking profile and social bio — it is a differentiator that costs nothing to communicate.",
          "Evaluate plant-based pomades and styling products from newer brands — current-generation formulas match conventional product performance."
        ],
        watchFor: "Watch for distributor bundles on sustainable product lines — as demand grows, wholesale pricing on eco alternatives will become more competitive."
      }
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
      outlook: {
        timeframe: "This Month",
        summary: "BaBylissPRO released its 2026 cordless FX clipper with longer battery life, quieter motor, and improved weight balance. Pre-orders through distributors are moving fast.",
        impact: "Spring equipment refreshes set barbers up for the busy summer season. The FX line is a staple in professional shops, and the quieter motor addresses one of the top client complaints during longer sessions.",
        actions: [
          "If you are due for a clipper upgrade, pre-order through your distributor now for best pricing before retail markup kicks in.",
          "Test the new model at a trade show or expo before committing — weight balance and motor sound are best evaluated in person.",
          "If your current setup works well, wait for 90-day reviews from working barbers before switching — first-look hype does not always hold up."
        ],
        watchFor: "Watch for bundled deals as BaBylissPRO pushes inventory through distributor channels in the pre-summer window. Best pricing often hits 6-8 weeks post-launch."
      }
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
      outlook: {
        timeframe: "This Quarter",
        summary: "Georgia, Texas, and Ohio legislators introduced bills to reduce barber licensing hours from 1,500+ to under 1,000, aiming to lower barriers to entry.",
        impact: "Reduced hour requirements could add hundreds of new licensed barbers to these markets within a year. For shop owners, that means more hiring options. For existing barbers, it means more competition — but also validation that the trade is growing.",
        actions: [
          "If you are in GA, TX, or OH, track the bill status through your state cosmetology board — these changes could affect your market within 12 months.",
          "Shop owners: start building relationships with barber schools now to get first pick of graduates when new talent enters the pipeline.",
          "If you are considering barber school, watch these states — reduced hour requirements could save you 3-6 months of training time and significant tuition."
        ],
        watchFor: "Watch whether North Carolina follows with its own reform bill. If neighboring states reduce requirements, NC may face pressure to stay competitive."
      }
    },
    {
      id: "c4acd406420e", desk: "clt-events", type: "original", byline: "RE UP Events Desk",
      title: "Carolina Barber Expo returns to Myrtle Beach in September \u2014 Charlotte barbers plan the trip",
      summary: "The Carolina Barber Expo is set for September 2026 at House of Blues in North Myrtle Beach, SC. Charlotte barbers are organizing group trips to compete and network with brands.",
      url: "#carolina-barber-expo-2026",
      source: "RE UP Report", date: "2026-02-24", score: 61, impact: "medium",
      tags: ["event","expo","myrtle-beach","networking","education"],
      body: [
        "The Carolina Barber Expo is returning to House of Blues in North Myrtle Beach, SC this September, and Charlotte barbers are already making plans. After record attendance in 2025, organizers are expanding the vendor floor and adding education workshops alongside the signature barber battle competitions.",
        "The expo is the biggest annual networking event for barbers across the Carolinas. Charlotte shops typically send teams to compete in battle categories and connect with distributors, product brands, and peers from other markets. Several Charlotte barbershops are organizing group trips, turning the expo into a team-building event.",
        "For Charlotte barbers who haven\u2019t attended before, the education workshops alone are worth the trip. Topics cover business fundamentals \u2014 pricing strategy, social media marketing, booth rent negotiation \u2014 alongside technical sessions on trending cuts and techniques led by nationally recognized barbers."
      ],
      outlook: {
        timeframe: "This Quarter",
        summary: "The Carolina Barber Expo returns to House of Blues in North Myrtle Beach this September with expanded vendor floor and education workshops alongside barber battle competitions.",
        impact: "The expo is the biggest annual networking event for Carolinas barbers. Education workshops cover pricing strategy, social media marketing, and booth rent negotiation — skills that directly affect your bottom line. Competition exposure builds your personal brand.",
        actions: [
          "Book Myrtle Beach accommodations now — beachfront hotels near House of Blues sell out during expo weekend every year.",
          "Watch the expo's social media for barber battle registration announcements if you want to compete and build your brand.",
          "Plan to attend at least two education workshops on business fundamentals — the ROI on pricing strategy knowledge alone pays for the trip."
        ],
        watchFor: "Watch for early-bird registration pricing and Charlotte shop group trip announcements — traveling with a team splits costs and builds camaraderie."
      }
    },
    {
      id: "82b0751671fb", desk: "clt-events", type: "original", byline: "RE UP Events Desk",
      title: "Charlotte FC and MLS All-Star Game to bring summer booking wave",
      summary: "Charlotte FC\u2019s 2026 season is underway at Bank of America Stadium, and the city will host the MLS All-Star Game this summer \u2014 a first for Charlotte.",
      url: "#mls-allstar-clt-2026",
      source: "RE UP Report", date: "2026-02-18", score: 67, impact: "medium",
      tags: ["charlotte-fc","mls","all-star-game","bookings","summer"],
      body: [
        "Charlotte FC\u2019s 2026 MLS season is underway at Bank of America Stadium, and the city just landed a marquee addition to the summer calendar: the MLS All-Star Game. It\u2019s the first time Charlotte will host the event, and it\u2019s expected to bring national media attention and thousands of traveling fans to the city.",
        "Barbershops near uptown and South End are already seeing match-day booking patterns emerge during Charlotte FC home games. The All-Star Game will amplify that effect significantly \u2014 it\u2019s a multi-day event with fan festivals, concerts, and the game itself, all concentrated near the stadium corridor.",
        "The Charlotte FC effect on barbershops is becoming a real thing. Match-day bookings spike as fans, particularly younger demographics, want a fresh cut before heading to the stadium. Shops that post game-day content on social media \u2014 team colors, match-day specials \u2014 are capturing an audience that indexes high on grooming spend."
      ],
      outlook: {
        timeframe: "This Quarter",
        summary: "Charlotte FC's 2026 season is underway, and the city will host the MLS All-Star Game this summer — the first time Charlotte hosts the event, bringing national media and thousands of traveling fans.",
        impact: "The All-Star Game is a multi-day event with fan festivals, concerts, and the game itself. Shops near uptown and South End will see amplified versions of the match-day booking spikes they already experience during regular Charlotte FC home games.",
        actions: [
          "Run match-day promotions tied to Charlotte FC home games now to build the habit before the All-Star Game amplifies demand.",
          "Post Charlotte FC content on your social media to attract the soccer crowd, which indexes high on grooming spend.",
          "Block the All-Star Game week for extended hours as soon as the date is announced — treat it like race week for scheduling."
        ],
        watchFor: "Watch for the official MLS All-Star Game date announcement. Once confirmed, book your team's schedules immediately — this will be the biggest single-event booking spike of the summer."
      }
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
      outlook: {
        timeframe: "This Week",
        summary: "Social media has overtaken word-of-mouth as the top client acquisition channel for barbers under 35, with top accounts reporting 60%+ of new clients from short-form video.",
        impact: "A barber with 10,000 engaged Instagram followers has a more valuable asset than a prime shop location. The audience follows the barber, not the building — giving digitally savvy barbers leverage on booth rent negotiations and shop ownership decisions.",
        actions: [
          "Start posting one transformation reel per week on Instagram this week — film the before, key moments of the cut, and the final result.",
          "Invest in a ring light ($20-30) and phone tripod — good lighting is the single biggest quality improvement for barber content.",
          "Track which posts generate DMs and booking requests to identify your highest-converting content format and double down on it."
        ],
        watchFor: "Watch for TikTok algorithm changes that may boost or suppress barber content. Diversify across Instagram and TikTok to avoid single-platform dependency."
      }
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
      outlook: {
        timeframe: "This Month",
        summary: "Urban Barber in 28209 near SouthPark is capturing a growing wave of young professionals booking Tuesday-Thursday appointments during lunch and after work.",
        impact: "Mid-week professional clients fill chairs during traditionally slow days, creating more consistent weekly revenue instead of weekend boom-and-bust patterns. Online booking is table stakes for this demographic.",
        actions: [
          "If your shop is near office areas, add dedicated 'lunch hour express' slots — guaranteed in-and-out in 30 minutes — to your booking platform.",
          "Ensure your online booking profile highlights efficiency and professionalism to attract the mid-week corporate crowd.",
          "Clients near SouthPark: book Urban Barber mid-week for shorter waits and a more relaxed experience compared to Saturday rushes."
        ],
        watchFor: "Watch whether remote work trends shift mid-week demand patterns. More office-return mandates could increase Tuesday-Thursday walk-in traffic near business districts."
      }
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

  // Render an impact badge (clickable → filtered news view)
  function impactBadge(impact) {
    if (!impact || impact === 'low') return '';
    var cls = impact === 'high' ? 'news-impact--high' : 'news-impact--medium';
    return '<span class="news-impact ' + cls + '" data-impact-link="' + escapeHtml(impact) + '">' + escapeHtml(impact.toUpperCase()) + '</span>';
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
        '<a class="news-card news-card--link" href="' + articleUrl(a) + '" data-desk="' + escapeHtml(a.desk) + '" data-score="' + escapeHtml(a.score || 0) + '">' +
          '<div class="news-card-header">' +
            '<span class="news-tag ' + meta.tagClass + '">' + escapeHtml(meta.label) + '</span>' +
            '<span class="news-date">' + escapeHtml(displayDate) + '</span>' +
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

  // escapeHtml is now provided by js/utils.js on window.escapeHtml

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
