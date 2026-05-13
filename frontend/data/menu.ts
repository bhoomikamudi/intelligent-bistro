export type MenuItem = {
  id: string;
  emoji: string;
  name: string;
  description: string;
  price: number;
};

export type MenuCategory = {
  id: string;
  title: string;
  items: MenuItem[];
};

export const menuCategories: MenuCategory[] = [
  {
    id: "starters",
    title: "Starters",
    items: [
      {
        id: "s1",
        emoji: "🥗",
        name: "Heirloom Burrata",
        description: "Whipped burrata, blistered cherry tomatoes, basil oil, aged balsamic",
        price: 14,
      },
      {
        id: "s2",
        emoji: "🦪",
        name: "Chilled Oysters",
        description: "Half dozen, mignonette, citrus granita, sea fennel",
        price: 22,
      },
      {
        id: "s3",
        emoji: "🍄",
        name: "Wild Mushroom Crostini",
        description: "Porcini duxelles, truffle butter, parmesan crisp",
        price: 12,
      },
    ],
  },
  {
    id: "mains",
    title: "Mains",
    items: [
      {
        id: "m1",
        emoji: "🥩",
        name: "Dry-Aged Ribeye",
        description: "16oz, bone-in, smoked bone marrow butter, charred spring onion",
        price: 48,
      },
      {
        id: "m2",
        emoji: "🐟",
        name: "Line-Caught Branzino",
        description: "Crispy skin, caper brown butter, fennel pollen, charred lemon",
        price: 36,
      },
      {
        id: "m3",
        emoji: "🍝",
        name: "Black Garlic Pappardelle",
        description: "Slow-braised short rib ragu, pecorino, toasted pine nuts",
        price: 28,
      },
    ],
  },
  {
    id: "sides",
    title: "Sides",
    items: [
      {
        id: "sd1",
        emoji: "🥔",
        name: "Triple-Cooked Chips",
        description: "Crisp edges, fluffy centers, rosemary salt, aioli",
        price: 9,
      },
      {
        id: "sd2",
        emoji: "🥦",
        name: "Charred Broccolini",
        description: "Calabrian chili, lemon zest, toasted garlic crumbs",
        price: 10,
      },
      {
        id: "sd3",
        emoji: "🌽",
        name: "Creamed Corn",
        description: "Sweet corn, brown butter, chives, smoked paprika",
        price: 8,
      },
    ],
  },
  {
    id: "drinks",
    title: "Drinks",
    items: [
      {
        id: "d1",
        emoji: "🍸",
        name: "Midnight Negroni",
        description: "Barrel-aged gin, bitter rosso, cacao mist, orange oils",
        price: 15,
      },
      {
        id: "d2",
        emoji: "🍷",
        name: "Sommelier's Pour",
        description: "Rotating red by the glass — ask your server",
        price: 14,
      },
      {
        id: "d3",
        emoji: "🫖",
        name: "Smoked Earl Grey",
        description: "Loose leaf, lapsang souchong rinse, honeycomb",
        price: 6,
      },
    ],
  },
  {
    id: "desserts",
    title: "Desserts",
    items: [
      {
        id: "ds1",
        emoji: "🍫",
        name: "Valrhona Fondant",
        description: "Molten center, malted cream, cocoa nib tuile",
        price: 12,
      },
      {
        id: "ds2",
        emoji: "🍨",
        name: "Olive Oil Gelato",
        description: "Sicilian oil, flaky sea salt, pistachio praline",
        price: 10,
      },
      {
        id: "ds3",
        emoji: "🍋",
        name: "Yuzu Pavlova",
        description: "Crisp meringue, passionfruit curd, mint oil",
        price: 11,
      },
    ],
  },
];
