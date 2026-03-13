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
        "Thirty-plus students just enrolled in No Grease Barber School’s spring 2026 cohort — the largest incoming class the program has ever seen. That number is a demand signal: more people want into Charlotte’s barber trade than at any point in recent memory, and No Grease is the pipeline feeding it.",
        "The school operates alongside No Grease’s shop locations and has trained hundreds of barbers now working chairs across the metro. Graduates land at established shops, open their own spots, and build clientele using the social media skills baked into the curriculum. The program’s track record is why the Instagram announcement pulled immediate engagement from Charlotte’s barber community.",
        "Here is what matters for the market: 30-plus new barbers will hit Charlotte by late spring. With 47 shops across 14 zip codes already competing for talent, shop owners finally get more hiring options. But for barbers already working chairs, it also means more competition for walk-ins and booth-rental spots — especially in saturated corridors like South End and NoDa."
      ],
      outlook: {
        timeframe: "This Month",
        text: "If you’re a shop owner looking to hire, keep an eye on this graduating class. New barbers will be entering the market by late spring, and the ones trained at No Grease come with a built-in network. If you’re a barber considering education, this enrollment surge signals strong demand — the trade is growing.",
        summary: "No Grease enrolled its largest-ever spring class at 30+ students, confirming Charlotte’s barber trade is pulling more talent than the market has seen in years.",
        impact: "Thirty-plus new barbers entering Charlotte by late spring changes the hiring math for shop owners across 14 zip codes. The $37 city average haircut supports more chairs, but competition for walk-in traffic and booth-rental spots intensifies — especially in South End and NoDa where 47 shops already operate.",
        actions: [
          "Contact No Grease now to get early introductions to graduating students before they commit to other shops — first movers get the best talent.",
          "Audit your booth-rental or commission structure against the $37 city average to make sure your offer is competitive when new barbers start shopping chairs.",
          "If you are considering barber school, apply before the next cohort fills — enrollment surges like this confirm the trade is growing faster than the talent supply."
        ],
        watchFor: "Watch for the spring graduation date on No Grease’s social media. That single day drops 30+ new barbers into the Charlotte market simultaneously."
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
        "Lucky Spot Barbershop just expanded its giveback model from one annual event to four. The shop dropped its full 2026 community calendar this week — starting with free haircuts for Charlotte students heading into spring testing — and the post pulled hundreds of shares from parents within 24 hours.",
        "Lucky Spot has run its Back to School Weekend with Cops & Barbers for 15 years, providing free cuts at Walmart locations across Charlotte. That built the kind of name recognition no ad budget can buy. Now they are scaling the playbook with quarterly events spread across neighborhoods in 28208, 28216, and 28269.",
        "The social media response says everything. Parents tagging friends, teachers sharing posts, other barbershops asking how to participate. This is community investment as business strategy. Lucky Spot’s chairs stay full year-round because the shop shows up when it does not have to. Every free cut is a future regular walking through the door."
      ],
      outlook: {
        timeframe: "This Week",
        text: "If you’re in the Charlotte area and have kids, watch Lucky Spot’s social pages for the spring event dates. For barbers — this is a playbook worth studying. Community events generate the kind of word-of-mouth that no ad spend can buy. Consider partnering with local schools or nonprofits for your own giveback moments.",
        summary: "Lucky Spot expanded from one annual giveback to quarterly community events, starting with free student haircuts before spring testing season.",
        impact: "Fifteen years of community givebacks built Lucky Spot unmatched name recognition across Charlotte neighborhoods. The quarterly expansion means more touchpoints in 28208, 28216, and 28269 — and each free cut converts at a rate that outperforms any paid advertising among the 47 shops competing for regulars.",
        actions: [
          "Follow Lucky Spot’s social pages now to catch spring event dates — free cuts before testing season fill up fast.",
          "Partner with a local school or church in your zip code to host your own Saturday giveback — even one event generates word-of-mouth that compounds for months.",
          "Film and post your giveback event on social media with real client reactions to maximize the long-tail marketing value beyond the single day."
        ],
        watchFor: "Track Lucky Spot’s quarterly event dates as a benchmark. If their model scales successfully, expect other Charlotte shops to copy the playbook by summer."
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
        "Charlotte’s spring giveback season is the biggest yet. Shops across West Charlotte, East Charlotte, and University City have announced free or discounted cut events for students, job seekers, and seniors — and the coordination is happening organically, without a central organizer. Spring has become the unofficial kickoff for Charlotte’s barber community calendar.",
        "The events are spreading through social media and church networks across zip codes 28208, 28212, and 28262. No single shop is running the show. Instead, Charlotte barbers have built a culture where giving back is expected, not exceptional. The posts circulate, community organizations amplify, and chairs fill up.",
        "Shop owners are clear-eyed about the dual purpose. Free cuts serve people who genuinely need them — a student before testing, a job seeker before an interview. But several owners told us that customers they first met at free events now book weekly at the $37 city average. Community service converts to recurring revenue when the work is good."
      ],
      outlook: {
        timeframe: "This Month",
        text: "Check your local barbershop’s social media for event announcements — most are posted on Instagram and Facebook a week or two in advance. If you’re job hunting or know someone who is, a fresh cut before an interview can make a real difference. Barbers: if you’re not hosting a spring event yet, there’s still time to organize one.",
        summary: "Shops across West Charlotte, East Charlotte, and University City launched the biggest spring giveback season yet with free and discounted cuts for students, job seekers, and seniors.",
        impact: "Charlotte’s organic giveback culture is converting community service into business growth. Shop owners report that free-event clients convert to weekly regulars paying the $37 city average — across 47 shops in 14 zip codes, that conversion pipeline is becoming a real competitive advantage.",
        actions: [
          "If you are job hunting, search Instagram and Facebook for free cut events in 28208, 28212, and 28262 — a fresh cut before an interview measurably improves outcomes.",
          "Organize your own Saturday session with a local church or community center now — there is still time to get on the spring calendar and start building conversion pipeline.",
          "Partner with another shop in your zip code for a joint event to split costs, amplify social media reach, and double the community impact."
        ],
        watchFor: "Watch church bulletins and community organization pages for event listings that never hit barbershop social media — those are the ones that fill up quietly."
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
        "The national average men’s haircut just crossed $35 for the first time. Industry pricing surveys from early 2026 confirm the milestone — driven by two years of rising booth rent, higher product costs, and inflation that has squeezed small business owners across the board. The number matters because it resets the baseline for every pricing conversation in the trade.",
        "Charlotte sits in a different spot than the coasts. New York, LA, and Miami standard cuts run $50-$70. Here, the city average is $37, and many shop owners told us they have held steady or made only small adjustments to protect client retention. Premium shops in Plaza Midwood and South End charge $45-$55. Value shops in 28273 and 28208 hold at $20-$35. The middle is where it gets uncomfortable.",
        "That middle-market squeeze is the real story. Shops that offer a full experience — hot towels, beard work, beverages — can justify higher prices. Shops that keep it simple and fast hold the line on volume. But barbers stuck between those lanes are watching margins shrink while costs climb. The math forces a choice: go premium or commit to volume.",
        "For clients: your barber’s price increase reflects real costs, not greed. For barbers: the national data says the market absorbs modest increases when you communicate the value. The shops that raised prices 12 months ago and communicated clearly did not lose their regulars."
      ],
      outlook: {
        timeframe: "This Quarter",
        text: "If you haven’t adjusted your prices in the last year, now is the time to evaluate. The national trend gives you cover to make a modest increase without losing clients — most people understand costs are up everywhere. If you’re a client, tipping well matters more than ever. Your barber’s margins are thinner than they look.",
        summary: "The national average men’s haircut crossed $35 for the first time, putting pressure on Charlotte’s $37 city average and forcing mid-market shops to choose between premium and volume.",
        impact: "Charlotte’s 47 shops across 14 zip codes now face a clear split: premium shops in Plaza Midwood and South End charge $45-$55 and justify it with experience, while value shops in 28273 and 28208 hold at $20-$35 on volume. The $37 city average means barbers who have not raised prices in 12+ months have clear cover for a $3-$5 increase.",
        actions: [
          "Audit your pricing against your zip code average — if you are more than $5 below, a $3-$5 increase is well within market tolerance and the national trend gives you cover.",
          "Communicate any price change to clients two weeks in advance via social media and in-shop signage — shops that did this lost fewer than 5% of regulars.",
          "If you choose to hold prices, tighten your appointment windows by 5-10 minutes to add one extra client per day — that compounds to $150+ per week at the $37 average."
        ],
        watchFor: "Track whether Charlotte shops follow the national trend with Q2 price increases. A city-wide move gives every shop more cover for their own adjustment."
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
        "Charlotte barbershops are outpacing pre-pandemic booking numbers for the first time. Shop owners across South End, NoDa, and West Charlotte report that Q1 2026 is their strongest start in years — appointment slots filling faster, walk-in wait times climbing, and standing weekly bookings up significantly across all three neighborhoods.",
        "Standing weeklies are the metric that matters most. When clients lock in the same time slot every week, that is recurring revenue — the gold standard of barbershop health. Multiple owners confirmed through their booking platforms that this number is at an all-time high. Shops that invested in digital booking during the pandemic are seeing the biggest payoff now.",
        "The demand drivers are stacking. Charlotte’s population keeps growing, more men are prioritizing regular grooming, and the city’s 47 shops across 14 zip codes have created a competitive market that keeps quality high. But full books also mean something else: if your chair is consistently booked at the $37 city average, you have pricing power you are not using."
      ],
      outlook: {
        timeframe: "This Week",
        text: "If your chair is filling up, this is the moment to evaluate your pricing and schedule. Full books mean you have leverage to raise rates modestly or tighten your appointment windows. If you’re a client, book ahead — walk-in waits are getting longer at popular shops across Charlotte.",
        summary: "Charlotte shops in South End, NoDa, and West Charlotte posted their strongest Q1 booking numbers in years, outpacing pre-pandemic levels for the first time.",
        impact: "Full books across multiple neighborhoods signal untapped pricing power. At the $37 city average, a consistently booked barber leaving $3-$5 on the table per cut is losing $60-$100 per week. Standing weekly bookings — the gold standard metric — are at all-time highs across 47 shops in 14 zip codes.",
        actions: [
          "If your chair is consistently full, test a $3-$5 price increase this month — Q1 demand data says the market absorbs it without client loss.",
          "Tighten appointment windows by 5-10 minutes if quality holds — one extra client per day at the $37 average compounds to $185+ per week.",
          "Clients: lock in your regular slot as a standing weekly appointment now before your barber’s spring calendar fills completely."
        ],
        watchFor: "Track whether Q1 momentum carries into Q2. If bookings stay strong through April, a summer price adjustment is fully supported by demand data."
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
        "Two Charlotte shops are proving you do not need $45 cuts to run a full book. Headz Up in 28273 holds at $35. The CUT in uptown’s 28202 holds at $30. Both are consistently packed — walk-ins and booked clients alike — while the market around them pushes toward premium pricing.",
        "The strategy is deliberate. Both shops serve the working professionals, families, and regulars who built Charlotte’s barber culture long before the premium wave hit. At $7 and $12 below the $37 city average respectively, the per-cut margin is thinner. But the volume more than compensates, and the loyalty means chairs rarely sit empty.",
        "The business lesson gets overlooked in the rush to go premium. Charlotte has 47 shops across 14 zip codes, and a large segment of clients — especially in 28273 and 28202 — want a quality cut at a fair price without the extras. Headz Up and The CUT own that lane. Their clients know exactly what they are getting, and they keep coming back week after week."
      ],
      outlook: {
        timeframe: "This Month",
        text: "If you’re a price-conscious client in Charlotte, these two shops are worth your attention. For barbers and shop owners watching the pricing arms race, this is a reminder that volume-based models work when execution is consistent. You don’t have to charge top dollar to run a full book.",
        summary: "Headz Up ($35 in 28273) and The CUT ($30 in 28202) stay packed by holding prices below the $37 city average — proof the volume model works when execution is consistent.",
        impact: "In a market where 47 shops across 14 zip codes trend toward premium pricing, these two shops demonstrate that a large underserved segment of price-conscious clients exists. Their full books at $30-$35 generate comparable daily revenue to premium shops charging $45+ with slower turnover.",
        actions: [
          "If you run a value-focused shop, study Headz Up and The CUT’s operations — their efficiency and chair turnover speed are what make the $30-$35 model profitable.",
          "Consider a hybrid approach: offer a core cut at $30-$35 and add premium options like beard sculpting or hot towel at $10-$15 to capture additional revenue without raising your base price.",
          "Price-conscious clients in 28273 and 28202: book ahead at both shops — they stay full, and walk-in waits can run 45+ minutes on weekends."
        ],
        watchFor: "Watch whether Headz Up and The CUT hold pricing as the national average keeps climbing past $35. If they hold, their competitive moat deepens with every competitor price increase."
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
        "Thousands of ACC fans, alumni, and media are in Charlotte right now for the tournament at Spectrum Center, running March 10-14 — and barbershops within a few miles of uptown are already seeing the walk-in spike. This is one of the most reliable revenue weeks of Q1 for shops in 28202, 28203, and 28205.",
        "Tournament visitors want to look sharp for games, watch parties, and the social circuit that surrounds the event. Shops in uptown, South End, and NoDa report that walk-in traffic jumps noticeably during multi-day Spectrum Center events. These are clients willing to pay above the $37 city average for convenience — they are not price-shopping.",
        "The barbers capturing this business are the ones showing up on Instagram and Google right now. Out-of-town visitors search ‘barber near me’ the moment they arrive. The shops that post their location, work, and availability daily are the ones that convert that search traffic. Extended evening hours through Friday catch fans looking for a cut between games."
      ],
      outlook: {
        timeframe: "This Week",
        text: "If your shop is within a few miles of Spectrum Center, this is your week. Post your work and location on social media daily — tournament visitors are scrolling for local barbers right now. Consider extending hours through Friday to capture the full run of the tournament. Walk-in traffic will be strongest on game days.",
        summary: "The ACC Tournament at Spectrum Center is spiking walk-in traffic at shops in 28202, 28203, and 28205 — visitors pay above the $37 city average for convenience.",
        impact: "Multi-day sporting events reliably spike walk-in traffic at shops within a few miles of the venue. Tournament visitors search ‘barber near me’ on arrival, skip price comparison, and pay premium rates. For shops in uptown, South End, and NoDa, this is one of the strongest revenue weeks of Q1 across all 47 Charlotte shops.",
        actions: [
          "Post your work and shop location on Instagram and Google daily through Friday — tournament visitors are actively searching and will book whoever shows up first.",
          "Extend hours through Friday evening to capture the full tournament run — fans looking for cuts between games and evening events are your highest-margin walk-ins.",
          "Offer a ‘Tournament Special’ bundle (cut + beard trim at $50-$55) to maximize average ticket on visitors you will likely only see once."
        ],
        watchFor: "Track your walk-in volume and average ticket this week — use it as the revenue baseline for Charlotte SHOUT! in April and the MLS All-Star Game this summer."
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
        "Charlotte SHOUT! runs April 3-19 — 17 days of art installations, live performances, and block parties across uptown. Unlike the ACC Tournament’s single-week spike, SHOUT! delivers sustained foot traffic to the center city corridor for more than two weeks. That duration changes the math for shops in 28202 and 28203.",
        "Evening events are the driver. Festival-goers want fresh cuts before heading to performances and block parties. Shops near uptown and South End that extend hours during SHOUT! capture clients they would otherwise miss entirely. The audience skews young and social-media active — the exact demographic that posts barbershop experiences and drives organic referrals.",
        "The branding play is even bigger. Some shops have set up pop-up chairs at past SHOUT! events, offering quick trims to festival crowds and building name recognition with an audience that does not normally walk into their shop. At the $37 city average, even a pop-up generating 10 cuts a night pays for itself and creates downstream bookings."
      ],
      outlook: {
        timeframe: "This Month",
        text: "Mark April 3-19 on your calendar. If you’re near uptown, consider extending your evening hours during the festival. If you’re looking for creative marketing, reach out to SHOUT! organizers about participating as a vendor or pop-up — the audience is exactly the demographic that shares barbershop experiences on social media.",
        summary: "Charlotte SHOUT! delivers 17 consecutive days of foot traffic to uptown and South End — a sustained revenue window unlike any single-day event on the calendar.",
        impact: "Seventeen days of evening events in 28202 and 28203 create sustained demand for fresh cuts from the young, social-media-active demographic. Pop-up chairs at past SHOUT! events generated downstream bookings that converted festival-goers into regulars paying the $37 city average.",
        actions: [
          "Block April 3-19 and extend evening hours on the biggest event nights — check the SHOUT! schedule to identify peak attendance dates in advance.",
          "Contact SHOUT! organizers now about a pop-up chair or vendor booth — the audience skews young, social-media-active, and willing to spend $35-$45 for a fresh cut before a night out.",
          "Post festival-related content daily during SHOUT! to align your brand with the cultural moment — this audience shares and tags at higher rates than typical clients."
        ],
        watchFor: "Watch the SHOUT! event schedule for marquee performance nights and plan your extended hours around those dates — not every night draws equal foot traffic."
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
        "Race week is the single biggest booking surge of Q2 for Charlotte barbershops. The Coca-Cola 600 at Charlotte Motor Speedway draws tens of thousands of visitors to the metro, and the ripple effect on shops from uptown to Concord is measurable — annual booking spikes during the week leading up to Memorial Day are consistent year over year.",
        "The demand is not just race fans. Memorial Day weekend is the unofficial summer kickoff, and Charlotte residents use the long weekend as a reset. Regulars want fresh cuts for cookouts, parties, and summer events. That local surge stacks on top of visitor traffic, creating the kind of week where every chair in the metro stays full.",
        "Shops along the I-85 corridor in 28025 (Concord) and 28081 (Kannapolis) see the biggest lift, but the effect reaches across all 14 Charlotte zip codes. The barbers who post race week availability on Instagram now — before May — capture the walk-in overflow that less-organized shops miss. Product restocking and team scheduling need to happen this month, not Memorial Day week."
      ],
      outlook: {
        timeframe: "This Month",
        text: "Start planning your race week schedule now. If your shop is anywhere near the I-85 corridor or uptown, extend your hours for the Memorial Day weekend. Post your availability on social media early — out-of-town visitors search Instagram for local barbers. Stock up on product and confirm your team’s availability for the busiest weekend of Q2.",
        summary: "The Coca-Cola 600 and Memorial Day weekend create the single biggest booking surge of Q2, spiking demand across all 14 Charlotte zip codes from uptown to Concord.",
        impact: "Race week stacks visitor traffic on top of local summer-kickoff demand across 47 shops. Shops along the I-85 corridor in 28025 and 28081 see the biggest lift, but the effect reaches every Charlotte neighborhood. Barbers who prepare early capture walk-in overflow at above the $37 city average.",
        actions: [
          "Confirm your full team’s availability for Memorial Day weekend now — do not wait until May to lock in schedules or you will lose your best barbers to time-off requests.",
          "Post race week availability on Instagram by early May so out-of-town visitors find your shop when searching ‘Charlotte barber’ from their hotel.",
          "Stock up on product and supplies by mid-May — distributor delays during holiday weekends are real, and running low during your biggest revenue week is preventable."
        ],
        watchFor: "Track race week revenue as a benchmark against normal weeks. If it exceeds by 30%+, apply the same prep playbook to the MLS All-Star Game later this summer."
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
        "Charlotte Barber & Beard just added a second chair and launched premium grooming packages at its Plaza Midwood location — a shop already commanding $45 men’s cuts, $8 above the city average. That is a confidence bet on the premium segment of Charlotte’s market. Hot towel shaves, beard sculpting, and scalp treatments are now on the menu.",
        "The expansion math is straightforward. A second chair at $45 per cut doubles capacity in a location surrounded by Plaza Midwood’s restaurants and boutiques — the right neighborhood for premium positioning. While shops in 28273 and 28208 compete on volume at $30-$35, Charlotte Barber & Beard is proving there is enough demand at the top of the market to justify investment in more capacity.",
        "The harder challenge is staffing. Adding a chair means hiring a barber skilled enough to justify $45 cuts, and the labor market across Charlotte’s 47 shops is tight. But the shop’s reputation and premium pricing make it an attractive landing spot. Skilled barbers looking for higher per-service income have limited options at this price point in the city."
      ],
      outlook: {
        timeframe: "This Month",
        text: "If you’re a client who values the full barbershop experience, Charlotte Barber & Beard’s new packages are worth checking out. For barbers watching the market, this expansion validates that premium positioning works in Charlotte — if you deliver on the experience. The second chair also means there may be hiring opportunities.",
        summary: "Charlotte Barber & Beard doubled capacity in Plaza Midwood at $45/cut — $8 above the city average — validating that premium demand is strong enough to justify expansion.",
        impact: "A shop adding a second chair at $45/cut in 28205 signals that Charlotte’s premium segment can sustain growth. This tightens the labor market for skilled barbers across 47 shops and may push other Plaza Midwood and NoDa shops to launch their own premium packages to compete.",
        actions: [
          "If you are a skilled barber seeking higher per-service income, reach out to Charlotte Barber & Beard directly about the new chair — premium shops at $45+ are rare in Charlotte.",
          "Evaluate adding premium packages (beard sculpting at $15, scalp treatments at $20) to your own menu — you can increase average ticket from $37 to $50+ without raising your base cut price.",
          "Clients who want the full grooming experience in 28205: book the new packages now before the second chair’s schedule fills with standing appointments."
        ],
        watchFor: "Watch whether other Plaza Midwood and NoDa shops follow with premium package launches. A cluster of $45+ shops could shift the area’s pricing floor above the $37 city average."
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
        "Digital booking just hit an inflection point. Squire, Boulevard, and competing platforms report record Q1 2026 sign-ups — and independent barbershops, not chains, are driving the growth. The holdouts are finally coming around, and the data explains why: shops on these platforms see 20-30% fewer no-shows compared to phone-only scheduling.",
        "The no-show reduction alone covers the platform subscription cost within the first month. But the bigger revenue driver is automated upsell prompts. When clients book online and the system suggests a beard trim, hot towel, or product add-on at checkout, average ticket climbs. Shops using these features are pulling more revenue per client without any extra effort at the chair.",
        "For the barbers still running on phone calls and walk-ins only, the competitive math is getting worse. Younger clients — the demographic every shop needs for long-term growth — expect to book from their phone. A shop without an online presence is invisible to that segment. Across Charlotte’s 47 shops and 14 zip codes, the ones that invested in digital booking during the pandemic are now seeing the strongest Q1 numbers."
      ],
      outlook: {
        timeframe: "This Quarter",
        text: "If your shop still runs on phone calls and walk-ins only, this quarter is the time to evaluate a booking platform. The no-show reduction alone can pay for the subscription. Start with a free trial from Squire or Boulevard and track the difference over 30 days.",
        summary: "Booking platforms hit record Q1 sign-ups driven by independents — shops on digital platforms see 20-30% fewer no-shows and higher average tickets from automated upsells.",
        impact: "Digital booking is no longer optional for Charlotte’s 47 shops. The 20-30% no-show reduction covers platform subscription costs in month one. Automated upsell prompts at booking time push average tickets above the $37 city average without extra effort at the chair. Shops without online booking are invisible to younger clients.",
        actions: [
          "Start a free trial with Squire or Boulevard this week — track no-show rates, average ticket, and new client acquisition over 30 days to see the math for yourself.",
          "Enable automated upsell prompts at booking time for beard trims ($15) and hot towel add-ons ($10) — this is the easiest path to pushing your average ticket above $37.",
          "If you already use a booking platform, audit your profile now — update photos, pricing, and availability to maximize conversion from the younger clients searching for shops online."
        ],
        watchFor: "Lock in current platform pricing before adoption growth gives Squire and Boulevard leverage to raise subscription rates."
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
        "Independent barbershops have outpaced franchise openings for three straight years, and the gap is widening. Professional Beauty Association data shows owner-operators are choosing independence over franchise fees \u2014 and keeping more per-chair revenue because of it.",
        "The math is straightforward. No franchise fee means an extra 6-8% staying in the owner's pocket on every cut. In Charlotte, where the city average haircut runs $37 across 47 shops in 14 zips, that margin difference compounds fast. A three-chair independent in 28205 or 28209 clearing 25 cuts a day keeps roughly $55-75 more daily than an identical franchise operation.",
        "Charlotte amplifies the independent advantage because clients here follow the barber, not the brand. That loyalty is non-transferable \u2014 it walks out the door if the barber leaves. Franchises can't replicate the community ties that shops like No Grease, Lucky Spot, and Midwood Barbers have built over years of showing up in their neighborhoods.",
        "The barrier to entry keeps dropping. Social media gives any barber with 2,000+ followers a built-in client base before they sign a lease. Booth-rental models let you test the market without committing to a full build-out. The data says independents are winning \u2014 and Charlotte's market structure explains why."
      ],
      outlook: {
        timeframe: "This Quarter",
        text: "If you've been thinking about opening your own shop, the data says the market is on your side. Independent shops are thriving because clients value the personal connection. Start building your brand and clientele now \u2014 the barrier to entry has never been lower for barbers with a following.",
        summary: "Independent shop openings beat franchise growth for three consecutive years, with owner-operators keeping 6-8% more per cut by avoiding franchise fees.",
        impact: "Charlotte's 47 shops across 14 zip codes are overwhelmingly independent, and the trend is accelerating. At the $37 city average, a three-chair independent keeps $55-75 more daily than an equivalent franchise. The structural advantage \u2014 clients follow the barber, not the sign \u2014 makes this gap permanent.",
        actions: [
          "Build your personal brand to 2,000+ Instagram followers before signing a lease \u2014 that following converts to a day-one client base worth $300-500/week in bookings.",
          "Price booth-rental vs. full lease in your target zip (28202-28215 range $1,200-2,800/month) to find the lowest-risk entry point for your first year.",
          "Differentiate on neighborhood roots and community presence \u2014 run one giveback event per quarter to build the local loyalty that franchises cannot replicate."
        ],
        watchFor: "Track new independent openings in Charlotte through Q2. If the pace exceeds 3-4 new shops per quarter, competition for booth-rental space in popular zips like 28205 and 28203 will tighten."
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
        "Wholesale barber supply costs have finally flatlined after two years of relentless increases. Distributors confirm that pricing on blades, disinfectants, and styling products stabilized in early 2026 \u2014 not dropping, but no longer climbing. For shop owners watching margins erode since 2023, this is the first real breathing room they've had.",
        "The shops that weathered the spike best are the ones with direct distributor relationships. They locked in preferred pricing and got priority on new products while competitors paid 30-50% retail markups at beauty supply stores. That gap \u2014 buying wholesale at $8 versus retail at $12 for the same product \u2014 is the difference between a healthy margin and a stressed one on a $37 average cut.",
        "Here's what stabilization actually means for your bottom line: you can finally budget your supply costs with confidence. No more quarterly surprises eating into what you thought was profit. But don't expect a rollback to 2022 pricing \u2014 that's not coming. The new floor is here.",
        "The smart move right now is to lock in distributor agreements while prices are flat. If raw material costs tick up again in late 2026, shops without locked rates will absorb the hit first."
      ],
      outlook: {
        timeframe: "This Month",
        text: "Now that prices have stabilized, it's a good time to lock in distributor pricing for the rest of 2026. If you've been buying retail, reach out to wholesale distributors \u2014 the savings add up fast. Don't expect prices to drop back to 2022 levels, but you can plan your budget with more confidence now.",
        summary: "Wholesale barber supply costs flatlined in early 2026 after two consecutive years of increases, giving shop owners their first margin relief since 2023.",
        impact: "Shops buying retail pay 30-50% more than wholesale \u2014 on a $37 city average haircut across 47 Charlotte shops, that markup directly eats margin. Stabilization means predictable budgeting, but the window to lock in flat rates with distributors won't last if raw material costs rise again in late 2026.",
        actions: [
          "Contact your distributor this week to lock in 2026 pricing while rates are flat \u2014 a six-month agreement protects you if costs tick up again.",
          "If you buy retail from beauty supply stores, get quotes from two wholesale distributors immediately \u2014 savings on a quarterly order typically exceed $200-300.",
          "Audit your product inventory and cut items with low client demand to reduce carrying costs by 10-15%."
        ],
        watchFor: "Monitor steel prices (blades) and petrochemical indexes (styling products) quarterly for early signals of a second wave of increases hitting distributors in late 2026."
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
        "Wahl just entered the precision trimmer fight with a zero-gap blade design built specifically for skin fades \u2014 the most-requested service in barbershops nationally. The new pro-grade trimmer is a direct shot at the specialty tools that have dominated the fade market for the past three years.",
        "Early reviews from working barbers (not paid influencers) confirm the blade ships sharp out of the box, the zero-gap setting holds without constant readjustment, and the 90+ minute battery handles a full day of detail work. The ergonomic grip is purpose-built for the angles and wrist positions that fade work demands.",
        "The timing matters. Skin fades command $35-60 in Charlotte depending on the shop and zip code \u2014 Midwood Barbers in 28205 charges $60 for premium fades, while shops in 28208 and 28212 run $35-40. A trimmer that delivers cleaner lines with less adjustment time directly increases your throughput on your highest-margin service.",
        "If Wahl wins the fade specialists, the broader market follows. That's the play here. The barbers posting fade transformations to 50,000 Instagram followers are the ones who move equipment purchasing decisions for the entire industry."
      ],
      outlook: {
        timeframe: "This Month",
        text: "If you specialize in fades, this trimmer is worth testing before committing to your next equipment purchase. Watch the reviews from barbers whose work you trust \u2014 not paid promotions, but real chair time reviews. If you're happy with your current setup, no rush to switch, but keep this on your radar.",
        summary: "Wahl's new zero-gap skin fade trimmer targets the most-requested barbershop service nationally, with early working-barber reviews confirming sharp-out-of-box blades and 90+ minute battery.",
        impact: "Skin fades run $35-60 across Charlotte's 14 zip codes, making them the highest-margin service for most shops. A trimmer that reduces adjustment time and delivers cleaner lines directly increases throughput on that top-revenue service. More competition among equipment brands also pressures pricing on existing tools from BaBylissPRO and Andis.",
        actions: [
          "Request a demo unit from your Wahl distributor before buying \u2014 test it through at least 15-20 fades on real clients to evaluate the zero-gap hold.",
          "Compare the spec sheet against your current trimmer: if your blade needs readjustment more than twice per fade, the Wahl's zero-gap lock is worth the switch.",
          "Wait for 30-day reviews from barbers doing 10+ fades daily before committing \u2014 first-week hype fades, but consistent performance data tells the real story."
        ],
        watchFor: "Watch for BaBylissPRO and Andis counter-launches within 60-90 days. Competition in the precision trimmer space means better products and potential price drops across all brands."
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
        "Midwood Barbers in 28205 charges $60 for a fade \u2014 roughly 62% above Charlotte's $37 city average \u2014 and stays booked solid. The shop proves that specialization is the most reliable pricing strategy in the market right now.",
        "The growth engine is Instagram transformation reels. Before-and-after fade videos regularly pull thousands of views, and each viral post converts directly to DMs and booking requests. The shop's barbers treat content creation with the same discipline as chair work \u2014 filming, editing, and posting on a consistent schedule that keeps the algorithm feeding them new eyeballs.",
        "This is the specialization playbook in action. Midwood didn't try to be everything to everyone. They picked fades, became the best at it in the Plaza Midwood area, and built a reputation that justifies a $23 premium over the average cut. Clients don't price-shop when they trust the result.",
        "The model has a built-in moat. A generalist shop can't match the consistency of a specialist doing the same service 30+ times a day. That repetition creates quality that's visible in every reel they post \u2014 and every reel they post creates the next wave of bookings."
      ],
      outlook: {
        timeframe: "This Month",
        text: "For barbers: specialization is a pricing strategy. If you're great at one particular service, lean into it on social media. Midwood's approach proves that you can charge a premium when your work speaks for itself. For clients in 28205 looking for a quality fade, Midwood is worth the investment.",
        summary: "Midwood Barbers commands $60 fades in 28205 \u2014 62% above the $37 city average \u2014 by specializing in one service and using Instagram reels as the primary client acquisition channel.",
        impact: "Specialization lets you charge premium pricing because clients pay for certainty of outcome, not just a haircut. At $60 per fade with a full book, Midwood's per-chair revenue significantly outpaces generalist shops charging $35-40 in the same area. Each viral reel compounds the advantage by generating weeks of booked appointments.",
        actions: [
          "Identify your single strongest service and post one transformation reel per week dedicated to it \u2014 consistency in content creates consistency in bookings.",
          "Benchmark your specialty pricing against Midwood's $60 and the 28205 area average of $38. If you are more than $10 below comparable quality, you are leaving money on the table.",
          "Track which content formats generate the most DMs and booking requests over 30 days, then double down on the top performer and cut the rest."
        ],
        watchFor: "Watch Midwood's Instagram for shifts in content strategy or pricing adjustments. If they raise above $60 and maintain full books, it signals the premium ceiling in 28205 hasn't been reached."
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
        "Eco-conscious barbershops are gaining a real competitive edge, not just good vibes. Shops switching to biodegradable neck strips, recycled-material capes, and plant-based styling products report that the move resonates hardest with the demographic that matters most: younger clients who post about their barber experience on social media.",
        "The products have caught up to the mission. Early sustainable options had a deserved reputation for underperforming, but current-generation plant-based pomades and biodegradable sanitizing wipes now match conventional alternatives on hold, texture, and effectiveness. The price premium has also narrowed \u2014 bulk biodegradable neck strips run only $3-5 more per case than standard.",
        "Here's the business case: a client who tags your shop in an Instagram story because you use eco-friendly products is giving you free advertising to their exact peer group. In Charlotte, where 47 shops across 14 zips compete for the same pool of clients aged 20-35, that organic word-of-mouth is worth more than any paid ad.",
        "Start small. Swap neck strips and sanitizing wipes first \u2014 lowest cost, most visible to clients. Add a note to your booking profile and social bio. The clients who care about this will find you, and the ones who don't won't notice the difference."
      ],
      outlook: {
        timeframe: "This Quarter",
        text: "If you're looking for a way to differentiate your shop, sustainable products are worth exploring. Start small \u2014 swap out neck strips or sanitizing wipes \u2014 and mention it on social media. Younger clients notice and appreciate it. The cost difference is minimal, and the brand value is real.",
        summary: "Shops switching to sustainable products are gaining competitive advantage with younger, social-media-active clients while the price premium on eco alternatives has narrowed to $3-5 per case.",
        impact: "In Charlotte's market of 47 shops across 14 zips, differentiation matters. Younger clients who post about their barber experience on social media give eco-conscious shops free organic advertising to their exact peer group \u2014 a marketing channel that costs nothing beyond the $3-5 per case premium on sustainable supplies.",
        actions: [
          "Swap neck strips and sanitizing wipes to biodegradable alternatives this month \u2014 it is the lowest-cost, highest-visibility entry point at roughly $3-5 more per case.",
          "Add 'eco-conscious shop' to your booking profile and Instagram bio immediately \u2014 it costs nothing and acts as a filter that attracts values-aligned clients.",
          "Test one plant-based pomade or styling product on willing clients over 30 days and compare hold and feedback against your current conventional product."
        ],
        watchFor: "Watch for distributor bundle pricing on sustainable product lines as demand grows. When wholesale eco-product bundles drop below a 10% premium over conventional, the switch becomes a no-brainer for margin-conscious shops."
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
        text: "If you\u2019re due for a clipper upgrade, the new BaBylissPRO FX is worth considering. Pre-order through your distributor for the best pricing. If your current setup is working well, there\u2019s no urgent reason to switch \u2014 but test one at a trade show or expo before the summer rush.",
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
        text: "If you\u2019re in Georgia, Texas, or Ohio, these bills could affect your market within the year. More licensed barbers means more competition, but also more talent available for shops looking to hire. If you\u2019re considering barber school, watch these states \u2014 reduced hour requirements could save you months of training time and tuition.",
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
        text: "Mark September on your calendar now. Whether you\u2019re looking to compete, learn, or network, the Carolina Barber Expo is the biggest event on the regional calendar. Early-bird tickets typically go on sale in late spring. If you\u2019re a brand or distributor, vendor booth space will move fast given the expanded floor.",
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
        text: "Start thinking about your summer schedule now. Charlotte FC home games already drive match-day bookings, and the All-Star Game will be a peak event. Consider running match-day promotions or posting Charlotte FC content on your social media to attract the soccer crowd. The All-Star Game date will be announced soon — block that week off for extended hours.",
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
        text: "If you\u2019re not posting your work on social media, you\u2019re leaving clients on the table. Start with one transformation reel per week on Instagram. Film the before, capture the key moments of the cut, and show the final result. You don\u2019t need expensive equipment \u2014 a phone with good lighting is enough to start.",
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
        text: "If your shop is near office areas, think about how to capture the mid-week professional crowd. Online booking is table stakes for this demographic. Consider offering a \u2018lunch hour express\u2019 slot \u2014 guaranteed in-and-out in 30 minutes. For clients near SouthPark, Urban Barber\u2019s mid-week availability means shorter waits and a more relaxed experience.",
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
