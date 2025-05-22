import { AiModels } from '@/configs/ai/AiModels';
import Constants from 'expo-constants';
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = Constants.expoConfig?.extra?.googleGeminiApiKey;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: AiModels.GEMINI_2_0_FLASH,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: 'user',
      parts: [
        {
          text: 'Generate Travel Plan in {en} localization for Location: {Rome}, for {2} Days and {1} Nights for {2} travelers with a {Moderate} budget with geo coordinates, rating, descriptions and Places to visit nearby with placeName, Place Details, Place rating, Geo Coordinates, ticket Pricing of the location for {2} days and {1} nights with each day plan with best time to visit in JSON format. The placeDetailsLongDescription must be between 200 and 350 words. Each day schedule must have between 3 and 5 activities.',
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `{
  "tripDetails": {
    "location": "Rome",
    "durationDays": 2,
    "durationNights": 1,
    "travelers": 2,
    "budget": "Moderate",
    "startDate": "05-18-2025",
    "endDate": "05-20-2025",
    "locale": "en",
  },
  "dayPlans": [
    {
      "day": 1,
      "theme": "Ancient Rome & Trastevere Charm",
      "schedule": [
        {
          "placeNumberID": 1,
          "activity": "Colosseum & Roman Forum",
          "placeName": "Colosseum",
          "placeDetails": "Iconic amphitheater of ancient Rome. Explore the arena and upper levels for stunning views.  Pre-book tickets to avoid long queues.",
          "placeDetailsLongDescription": "The Colosseum stands as Rome's most iconic monument, a colossal amphitheater that has defied time for nearly two millennia. This majestic oval structure, officially named the Flavian Amphitheatre, rises dramatically from the heart of the ancient city, its weathered travertine facade telling stories of imperial glory and brutal spectacle.Constructed between 70-80 CE, the Colosseum once hosted gladiatorial combats, wild animal hunts, and mock naval battles that captivated up to 50,000 spectators. Today, visitors can wander through its labyrinthine corridors, standing where emperors once presided over life-and-death entertainment.The arena's impressive architecture reveals Roman engineering genius—a complex system of arches, vaults, and tiered seating that revolutionized public gathering spaces. From the upper levels, breathtaking panoramic views of Rome await, showcasing the adjacent Roman Forum and Palatine Hill.To avoid the notoriously long queues that snake around this UNESCO World Heritage site, pre-booking tickets is essential. The experience offers an unparalleled window into ancient Roman society, where spectacle and political power intertwined beneath the Mediterranean sun.Despite centuries of earthquake damage, stone-robbing, and pollution, the Colosseum remains an enduring symbol of Rome's eternal spirit.",
          "placeSecretsAndInsights": "Visit during the first Sunday of the month for free entry. The third tier reopened after decades of closure offers spectacular views rarely seen by tourists. Look for the holes in the stone exterior—they once held bronze clamps stolen during medieval times. The northern side is best preserved and shows the original facade structure. For the shortest lines, enter through the Roman Forum entrance instead of the main Colosseum entrance. Consider twilight tours for a magical atmosphere with smaller crowds.",
          "geoCoordinates": {
            "latitude": 41.8902,
            "longitude": 12.4922
          },
          "rating": 4.6,
          "ticketPricing": 18,
          "bestTimeToVisit": "Morning (before crowds)"
        },
        {
          "placeNumberID": 2,
          "activity": "Roman Forum & Palatine Hill",
          "placeName": "Roman Forum",
          "placeDetails": "Explore the ruins of the ancient Roman government buildings and temples. Palatine Hill offers panoramic views of the Forum.",
          "placeDetailsLongDescription": "The Roman Forum unfolds as a sprawling archaeological wonder nestled between the Palatine and Capitoline Hills—the political, religious, and commercial nucleus of ancient Rome. This remarkable valley of ruins tells the story of a civilization that shaped Western history, with fragmented columns, weathered marble, and crumbling temples emerging from the earth like memories made stone.For over a millennium, this was where Rome's destiny unfolded—where senators debated, emperors were celebrated, and citizens gathered. The sacred Via Sacra winds through this open-air museum, passing architectural treasures including the Temple of Saturn, the Arch of Septimius Severus, and the ancient Senate House where the republic's fate was decided.Rising majestically above the Forum, Palatine Hill offers a serene contrast with its cypress trees and breathtaking panoramic views. According to legend, this is where Romulus founded Rome in 753 BCE. Later, emperors built lavish palaces here, transforming the hill into an exclusive imperial neighborhood.From this elevated vantage point, visitors can survey the entire Forum spread below—a stunning visual timeline spanning centuries of Roman triumph and tragedy. The juxtaposition of ruined grandeur against the modern city creates a powerful reminder of civilization's cyclical nature and Rome's enduring influence on our world.",
          "placeSecretsAndInsights": "Access the Forum through the less-crowded Palatine Hill entrance to avoid lines. Look for the Temple of Caesar marking where Julius Caesar was cremated—Romans still leave flowers there. Visit early morning or late afternoon for golden-hour photography. The House of Augustus on Palatine Hill features stunning preserved frescoes often overlooked by tourists. Find the ancient graffiti on marble chunks near the Senate House. The stepped path leading to Palatine offers the most photogenic views of the entire Forum complex.",
          "geoCoordinates": {
            "latitude": 41.8925,
            "longitude": 12.4853
          },
          "rating": 4.5,
          "ticketPricing": "Included with Colosseum ticket",
          "bestTimeToVisit": "Afternoon"
        },
        {
          "placeNumberID": 3,
          "activity": "Trastevere Exploration & Dinner",
          "placeName": "Trastevere",
          "placeDetails": "Wander through the charming cobblestone streets of Trastevere, browse artisan shops, and enjoy a traditional Roman dinner at a trattoria.",
          "placeDetailsLongDescription": "Trastevere enchants visitors as Rome's most charismatic neighborhood, a labyrinth of narrow cobblestone streets and centuries-old buildings washed in warm ochre and terracotta hues. Nestled across the Tiber River—its name literally means 'beyond the Tiber'—this district preserves the authentic spirit of old Rome while vibrating with contemporary energy.By day, sunlight filters through ivy-draped buildings, illuminating artisan workshops where craftspeople create handmade jewelry, ceramics, and leather goods. Medieval churches like Santa Maria in Trastevere, with its dazzling 13th-century mosaics, stand as quiet sentinels amid the bustle of daily life.As evening descends, Trastevere transforms. Fairy lights twinkle above piazzas, locals emerge for passeggiata, and the aroma of Roman cooking wafts from countless trattorias. Here, traditional dishes reign supreme—cacio e pepe, carbonara, and supplì are prepared according to recipes passed through generations.The neighborhood's heartbeat centers on Piazza di Santa Maria, where street musicians perform against a backdrop of bubbling fountains. Locals and visitors alike gather at outdoor tables, sipping wine and embracing the quintessential Roman art of unhurried enjoyment.Trastevere offers something increasingly rare in major tourist destinations—an authentic slice of local life where Rome's timeless charm and culinary traditions thrive beyond the shadow of monuments.",
          "placeSecretsAndInsights": "Explore the hidden alleyways off Via della Lungaretta for authentic workshops. Visit the medieval house at Vicolo dell'Atleta 23. The Orto Botanico garden offers serene respite from crowds. For the best photography, arrive at dawn when locals prepare for the day. Seek out Da Enzo al 29 for authentic Roman cuisine—arrive right at opening to avoid hours-long waits. The church of San Crisogono contains ancient ruins beneath its floor that can be visited separately. On summer evenings, follow music to impromptu concerts in Piazza di San Calisto.",
          "geoCoordinates": {
            "latitude": 41.887,
            "longitude": 12.47
          },
          "rating": 4.7,
          "ticketPricing": "Free (dinner cost varies)",
          "bestTimeToVisit": "Evening"
        },
        {
          "placeNumberID": 4,
          "activity": "Enjoy Italian Dinner",
          "placeName": "Trastevere",
          "placeDetails": "Enjoy the best italian Dishes",
          "placeDetailsLongDescription": "Trastevere enchants visitors as Rome's most charismatic neighborhood, a labyrinth of narrow cobblestone streets and centuries-old buildings washed in warm ochre and terracotta hues. Nestled across the Tiber River—its name literally means 'beyond the Tiber'—this district preserves the authentic spirit of old Rome while vibrating with contemporary energy.By day, sunlight filters through ivy-draped buildings, illuminating artisan workshops where craftspeople create handmade jewelry, ceramics, and leather goods. Medieval churches like Santa Maria in Trastevere, with its dazzling 13th-century mosaics, stand as quiet sentinels amid the bustle of daily life.As evening descends, Trastevere transforms. Fairy lights twinkle above piazzas, locals emerge for passeggiata, and the aroma of Roman cooking wafts from countless trattorias. Here, traditional dishes reign supreme—cacio e pepe, carbonara, and supplì are prepared according to recipes passed through generations.The neighborhood's heartbeat centers on Piazza di Santa Maria, where street musicians perform against a backdrop of bubbling fountains. Locals and visitors alike gather at outdoor tables, sipping wine and embracing the quintessential Roman art of unhurried enjoyment.Trastevere offers something increasingly rare in major tourist destinations—an authentic slice of local life where Rome's timeless charm and culinary traditions thrive beyond the shadow of monuments.",
          "placeSecretsAndInsights": "Explore the hidden alleyways off Via della Lungaretta for authentic workshops. Visit the medieval house at Vicolo dell'Atleta 23. The Orto Botanico garden offers serene respite from crowds. For the best photography, arrive at dawn when locals prepare for the day. Seek out Da Enzo al 29 for authentic Roman cuisine—arrive right at opening to avoid hours-long waits. The church of San Crisogono contains ancient ruins beneath its floor that can be visited separately. On summer evenings, follow music to impromptu concerts in Piazza di San Calisto.",
          "geoCoordinates": {
            "latitude": 41.887,
            "longitude": 12.47
          },
          "rating": 4.5,
          "ticketPricing": "Varies",
          "bestTimeToVisit": "Evening"
        }
      ]
    },
    {
      "day": 2,
      "theme": "Vatican City & Pantheon Wonder",
      "schedule": [
        {
          "placeNumberID": 5,
          "activity": "Vatican City: St. Peter\\'s Basilica & Vatican Museums",
          "placeName": "Vatican City",
          "placeDetails": "Visit St. Peter\\'s Basilica, a magnificent Renaissance church, and explore the Vatican Museums, home to the Sistine Chapel and a vast collection of art.",
          "placeDetailsLongDescription": "Vatican City rises as a sovereign enclave within Rome, the world's smallest independent state and spiritual epicenter of Roman Catholicism. This hallowed city-state houses an unparalleled concentration of artistic and architectural masterpieces that span millennia of human creativity and devotion.St. Peter's Basilica dominates the landscape, its magnificent dome—designed by Michelangelo—soaring above the Roman skyline. Inside, the basilica unfolds in breathtaking grandeur with marble-clad walls, gilded ceilings, and Bernini's bronze baldachin spiraling toward heaven. Beneath lies the sacred grottos containing papal tombs, including that of St. Peter himself.The Vatican Museums form an extraordinary labyrinth of beauty comprising over 1,400 rooms filled with treasures collected by popes across centuries. Visitors journey through Egyptian antiquities, Renaissance paintings, classical sculptures, and elaborate tapestries before reaching the transcendent finale—the Sistine Chapel, where Michelangelo's celestial ceiling frescoes and monumental Last Judgment leave viewers spellbound in contemplative awe.The museums' highlights include Raphael's Rooms, the Gallery of Maps with its topographical frescoes, and the spiral Bramante Staircase. Throughout these sacred halls, faith and artistic genius intertwine, creating a profound testament to humanity's highest spiritual and creative aspirations.For visitors, this remarkable enclave offers an experience that transcends ordinary tourism and touches the sublime.",
          "placeSecretsAndInsights": "Book an early-entry ticket to see the Sistine Chapel nearly empty. Visit on Wednesday mornings to potentially attend Papal Audience. The Vatican Gardens offer exclusive tours with incredible photo opportunities and fewer crowds. Climb the dome of St. Peter's at opening time to avoid claustrophobic crowds in the narrow staircase. The Post Office sells sought-after Vatican stamps—perfect souvenirs. Look for the optical illusion in St. Peter's Square: from marked spots, the multiple columns perfectly align to appear as single rows.",
          "geoCoordinates": {
            "latitude": 41.9029,
            "longitude": 12.4534
          },
          "rating": 4.8,
          "ticketPricing": 35,
          "bestTimeToVisit": "Early morning (to avoid crowds)"
        },
        {
          "placeNumberID": 6,
          "activity": "Lunch near Vatican City",
          "placeName": "Borgo",
          "placeDetails": "Find a local trattoria in the Borgo neighborhood near Vatican City for a delicious lunch.",
          "placeDetailsLongDescription": "Borgo unfolds as a charming medieval district nestled in the shadow of Vatican City's walls, offering respite to pilgrims and tourists alike after their spiritual and artistic explorations. This compact neighborhood of narrow, atmospheric streets has served as the historical connection between Rome proper and the papal enclave for centuries.The district comprises the 'Borghi'—small thoroughfares lined with Renaissance and Baroque buildings in subdued ochre and amber tones. Amid this architectural tapestry, local trattorias beckon with red-and-white checkered tablecloths and handwritten menus showcasing traditional Roman cuisine.These family-run establishments serve as sanctuaries of authentic gastronomy where travelers can savor classic dishes like tonnarelli cacio e pepe, Roman artichokes, and tender saltimbocca alla romana. The air fills with the comforting aromas of simmering tomato sauce and freshly baked bread, while local Romans and Vatican workers engage in animated lunchtime conversations.Beyond its culinary treasures, Borgo preserves fascinating historical elements—ancient archways, hidden courtyards, and the remains of the Passetto di Borgo, the elevated escape route used by popes during times of danger. Small artisan shops display religious mementos and handcrafted goods alongside neighborhood delis selling local cheeses and wines.Here, away from overwhelming crowds, visitors discover an authentic slice of Roman life where tradition endures and leisurely lunches remain an essential daily ritual.",
          "placeSecretsAndInsights": "Look for Passetto di Borgo, the secret escape route used by popes fleeing danger. Visit Mamma Ristorante on Via Sforza, beloved by Vatican employees but overlooked by tourists. Explore the tiny medieval Via del Mascherino. The bakery Dolce Maniera operates 24 hours with delicious fresh pastries at dawn. For authentic papal cuisine, try Ristorante dei Musei near the Vatican walls—the Swiss Guards eat here. Shop at Castroni for unique Italian food souvenirs. Borgo Pio offers the most photogenic traditional Roman streetscapes.",
          "geoCoordinates": {
            "latitude": 41.905,
            "longitude": 12.455
          },
          "rating": 4.4,
          "ticketPricing": "Varies",
          "bestTimeToVisit": "Lunchtime"
        },
        {
          "placeNumberID": 7,
          "activity": "Pantheon & Piazza Navona",
          "placeName": "Pantheon",
          "placeDetails": "Marvel at the architectural genius of the Pantheon, an ancient Roman temple with a stunning dome.  Then, stroll through Piazza Navona, a beautiful baroque square.",
          "placeDetailsLongDescription": "The Pantheon stands as ancient Rome's most perfectly preserved monument, an architectural miracle that continues to awe visitors after nearly two millennia. This majestic temple, dedicated to all gods, showcases Roman engineering at its zenith—defined by its perfect proportions and crowned by a magnificent concrete dome that remained unsurpassed for 1,300 years.Entering through massive bronze doors, visitors step into a vast cylindrical space where mathematics, light, and spirituality converge. The oculus—a 30-foot circular opening at the dome's apex—serves as the building's sole light source, casting a moving spotlight across the polished marble interior as the earth rotates. This celestial connection transforms the Pantheon into a colossal sundial, marking time's passage with ethereal beauty.A short stroll away lies Piazza Navona, Rome's most elegant baroque square built over Emperor Domitian's ancient stadium. Three magnificent fountains punctuate this elongated piazza—dominated by Bernini's masterpiece Fountain of the Four Rivers, where dramatic marble figures represent the world's great waterways beneath a soaring Egyptian obelisk.The piazza pulses with vibrant energy as street artists sketch portraits, musicians perform, and café patrons savor espresso at outdoor tables. Renaissance palaces and the façade of Sant'Agnese in Agone church provide a theatrical backdrop to this living urban stage where Rome's past and present harmoniously coexist in perpetual dialogue.",
          "placeSecretsAndInsights": "Visit during rainfall to witness the spectacular water show through the oculus. Test the perfect acoustics by standing in the exact center and speaking normally—your voice will echo dramatically. Look for Raphael's tomb on the left side. The Pantheon's height and diameter both measure exactly 43.3 meters—revealing perfect mathematical proportions. For incredible photos, arrive at 11am-1pm when sunbeams pierce through the oculus. After exploring, find Giolitti nearby for Rome's most famous gelato. The piazza's obelisk is nicknamed the 'little pig' by locals.",
          "geoCoordinates": {
            "latitude": 41.8986,
            "longitude": 12.4769
          },
          "rating": 4.5,
          "ticketPricing": "Free (Pantheon entry)",
          "bestTimeToVisit": "Afternoon"
        },
        {
          "placeNumberID": 8,
          "activity": "Trevi Fountain",
          "placeName": "Trevi Fountain",
          "placeDetails": "The Trevi Fountain is the largest Baroque fountain in the city and one of the most famous fountains in the world. ",
          "placeDetailsLongDescription": "The Trevi Fountain erupts from the façade of Palazzo Poli like a mythological vision frozen in stone—a triumphant symphony of cascading water and sculpted marble that stands as Rome's most theatrically spectacular fountain. This monumental Baroque masterpiece, completed in 1762 by Nicola Salvi, commands an entire piazza yet feels intimately connected to the city's ancient aquatic heritage, marking the terminus of the Aqua Virgo aqueduct that has supplied Rome with water since 19 BCE.Dominating the composition, the sea god Neptune rides a shell chariot pulled by Tritons with seahorses—one wild, one docile—symbolizing the sea's contrasting moods. Water surges around the central figures, spilling across an artificial reef into a shimmering basin that seems to illuminate the entire piazza with its crystalline reflections and aquamarine hues.The fountain's travertine façade rises nearly 86 feet high and spans 161 feet, creating a breathtaking aquatic tableau against the narrow confines of the square. Allegorical figures representing Abundance and Health flank the central niche, while relief sculptures above depict the Roman virgin who allegedly revealed the water source to thirsty soldiers.Visitors crowd the piazza day and night, participating in the enduring tradition of tossing a coin over their shoulder into the water—a ritual said to ensure a return to the Eternal City. The fountain collects approximately €3,000 daily, funds directed toward charitable causes throughout Rome.",
          "placeSecretsAndInsights": "Visit before dawn (around 6am) to experience the fountain completely alone—a magical experience impossible during regular hours. Look for the small overflow basin called the 'Ace of Cups' on the fountain's right side. Spot the health symbol: a small vase hidden among the rocks. The tradition calls for throwing coins with your right hand over your left shoulder. The best nighttime photos come when visiting after 11pm. Gelato at nearby Fatamorgana offers unique Roman flavors. For perfect photos without crowds, visit during winter mornings.",
          "geoCoordinates": {
            "latitude": 41.9009,
            "longitude": 12.4833
          },
          "rating": 4.6,
          "ticketPricing": "Free (Pantheon entry)",
          "bestTimeToVisit": "Afternoon"
        }
      ]
    }
  ],
  "weather": {
    "weatherGeneralNotes": "In May, Rome experiences pleasant spring weather, making it an ideal time for travel.",
    "averageHighTemperature": "Approximately 22.8°C (73°F)",
    "averageLowTemperature": "Around 11.6°C (53°F)",
    "daylight: "Approximately 14 hours and 34 minutes",
    "weatherClothingNotes": "Light layers are recommended. Mornings and evenings can be cool, so a light jacket or sweater is advisable.",
    "weatherSunProtectionNotes": "With a high UV index, it's important to use sunscreen, wear sunglasses, and consider a hat for sun protection.",
    "weatherRainPreparednessNotes": "While May isn't the wettest month, occasional showers can occur. Packing a compact umbrella or a light raincoat is prudent.",
    "weatherOutdoorActivitiesNotes": "The pleasant temperatures and extended daylight hours make it a great time for sightseeing and outdoor dining.",
  },
  "food": {
    "foodGeneralNotes": "Rome is renowned for its culinary delights, offering a wide range of traditional Italian dishes.",
    "typicalDishes": [
      "cacio e pepe",
      "carbonara",
      "supplì",
      "Roman artichokes"
    ],
    "foodBudgetNotes": "With a moderate budget in Rome, travelers can enjoy two-course meals at traditional osterias or trattorias, often including pasta, a main dish, and local wine, for around €20–€35 per person. Many restaurants also offer prix fixe menus with seasonal Roman dishes in this price range.",
  },
  "budgetNotes": "This is a moderate budget plan.  To save money, consider: using public transport, eating at local pizzerias or markets, packing snacks, and looking for free activities.  Entrance fees and dining costs are estimates and can be adjusted.",
  "transportationNotes": "Rome has an efficient public transport system (metro, buses, trams).  Consider purchasing a Roma Pass for unlimited travel and discounts on attractions.  Walking is also a great way to explore the city."
}`,
        },
      ],
    },
  ],
});
