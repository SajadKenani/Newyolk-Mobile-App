export interface AssetsTranslations {
  title: string
  page: string
  of: string
  marketplace: {
    list: string
    listed: string
    delist: string
    buy: string
    buyFloor: string
    price: string
    remaining: string
    topBid: string
    floorPrice: string
    listItems: string
    setAllTo: string
    liveFloor: string
    proceeds: string
    marketplaceFee: string
    totalEstProceeds: string
    autoAdjustForFees: string
    expires: string
    duration: string
    item: string
    items: string
    cancel: string
    activity: string
    sales: string
    durations:
      | {
          label: string
          value: string
        }[]
      | Record<
          string,
          {
            label: string
            value: string
          }
        >
    listingFilters:
      | {
          label: string
          value: "price_asc" | "price_desc" | "createdAt_asc" | "createdAt_desc"
          orderBy: {
            buyNowPrice?: "asc" | "desc"
            createdAt?: "asc" | "desc"
          }
        }[]
      | Record<
          number | string,
          {
            label: string
            value: "price_asc" | "price_desc" | "createdAt_asc" | "createdAt_desc"
            orderBy: {
              buyNowPrice?: "asc" | "desc"
              createdAt?: "asc" | "desc"
            }
          }
        >
  }
  card: {
    youOwnPack: string
    youOwnHen: string
    youOwnEgg: string
    notFarming: string
    notHatching: string
    hatching: string
    insured: string
    yes: string
    no: string
    eggs: string
    farming: string
    hens: string
  }
  hen: {
    farmingDetails: string
    ownedBy: string
    description: string
    maleDescription: string
    deadDescription: string
    production: string
    insured: string
    days: string
    yes: string
    no: string
    isGrowing: string
    isFarming: string
    daily: string
    farmingSince: string
    growingSince: string
    startFarming: string
    rent: string
    growthSchedule: string
    rewardSchedule: string
    oneTimeReward: string
    total: string
    isInsured: string
    food: string
    rewards: string
    dailyProduction: string
    dailyFood: string
    buttons: {
      burn: string
      evolve: string
      startBreed: string
      finishBreed: string
    }
    toasts: {
      burn: {
        pending: string
        success: string
        error: string
      }
      evolve: {
        pending: string
        success: string
        error: string
      }
      startBreed: {
        pending: string
        success: string
        error: string
      }
      finishBreed: {
        pending: string
        success: string
        error: string
      }
    }
  }
  pack: {
    pack: string
    youWillReceive: string
    ownedBy: string
    the: string
    packContains: string
    hensEstimated: string
    description: string
    hens: string
    eggsPerYear: string
    oneYearRent: string
    button: string
    toast: {
      pending: string
      success: string
      error: string
    }
  }
  egg: {
    name: string
    ownedBy: string
    insured: string
    yes: string
    no: string
    days: string
    description: string
    isHatching: string
    hatchingDetails: string
    rent: string
    farmingSince: string
    buttons: {
      incubate: string
      hatch: string
    }
    toasts: {
      incubate: {
        pending: string
        success: string
        error: string
      }
      hatch: {
        pending: string
        success: string
        error: string
      }
    }
  }
  cattle: {
    descriptionPresale: string
    farmingDetails: string
    ownedBy: string
    description: string
    maleDescription: string
    deadDescription: string
    production: string
    maleProduction: string
    insured: string
    days: string
    yes: string
    no: string
    isGrowing: string
    isFarming: string
    daily: string
    farmingSince: string
    growingSince: string
    startFarming: string
    rent: string
    growthSchedule: string
    rewardSchedule: string
    oneTimeReward: string
    total: string
    button: string
    gestationalAge: string
    milkProduction: string
    MILKIUM: string
    expectedDateOfBirth: string
    noOfBirth: string
    rewards: string
    isInsured: string
    initialReservation: string
    notes: string
    dailyProduction: string
    note: string
    toast: {
      pending1: string
      pending2: string
      success: string
      error: string
    }
  }
}
export interface CountdownTranslations {
  day: string
  days: string
  hour: string
  hours: string
  minute: string
  minutes: string
  second: string
  seconds: string
  month?: string
  year?: string
}
export interface FarmTranslations {
  heading: string
  farm: string
  buy: string
  deposit: string
  reinvest: string
  levels: string
  assets: string
  extendRent: string
  extendRentDescription: string
  total: string
  submit: string
  cancel: string
  yield: {
    title: string
    daily: string
    total: string
    remaining: string
  }
  exchange: {
    youPay: string
    youReceive: string
    button: string
    toast: {
      pending: string
      success: string
      error: string
      insufficientBalance: string
    }
  }
  balance: {
    title: string
    rewardsAvailable: string
    foodNeeded: string
    marketplace: string
    button: string
    toast: {
      handleFeed: string
      feed: {
        pending: string
        success: string
        error: string
      }
    }
  }
  poultry: {
    title: string
    growingUp: string
    farming: string
    available: string
    chicks: string
    cockerels: string
    hens: string
    roosters: string
    cattles: string
    bulls: string
    heifers: string
    dialog: {
      farm: string
      buyHens: string
      title: string
      description: string
      label: string
      max: string
      button: string
      toast: {
        pending: string
        success: string
        error: string
      }
    }
  }
  gift: {
    title: string
    available: string
    notAvailable: string
    open: string
    openShort: string
    text: string
    button: string
    close: string
    carousel: {
      click: string
      openShort: string
      tryAgain: string
      description: string
      uniqueOutcomes: string
    }
    terms: {
      title: string
      accept: string
      agree: string
      button: string
      list: string[]
      toast: {
        pending: string
        success: string
        error: string
      }
    }
  }
}
export interface ContactTranslations {
  title: string
  subtitle: string
  channels: {
    title: string
    text: string
    href: string
  }[]
  contactForm: {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    message: string
    button: string
  }
  map: {
    heading: {
      title: string
      text: string
    }
    locations: {
      type: string
      country: string
      city: string
      state: string
      address: string
      latitude: string
      longitude: string
    }[]
  }
  documents: {
    heading: {
      title: string
      text: string
    }
    socialHeadquarters: string
    workPoint: string
    docs: {
      name: string
      path: string
      fullPath: string
    }[]
    companyIDs: {
      name: string
      value: string
    }[]
  }
  management: {
    heading: {
      title: string
      text: string
    }
    members: {
      position: string
      name: string
      email: string
    }[]
  }
}
export interface BenefitsTranslations {
  title: string
  link: string
  benefits: {
    title: string
    text: string
    backgroundUrl: string
    iconUrl: string
    imageUrl: string
    light: string
  }[]
}
export interface ServicesTranslations {
  title: string
  heading: string
  services: {
    title: string
    text: string
    list?: string
  }[]
}
export interface JoinTranslations {
  title1: string
  title2: string
  text: string
  button: string
}
export interface BenefitsTranslations {
  title: string
  link: string
  benefits: {
    title: string
    text: string
    backgroundUrl: string
    iconUrl: string
    imageUrl: string
    light: string
  }[]
}
export interface CollaborationTranslations {
  title: string
  text: string
  costs: {
    title: string
    type: string
    text?: string
    value: number
  }[]
}
export interface FeaturesTranslations {
  features: {
    title: string
    text: string
    imageUrl: string
    iconUrl: string
    notification: string
  }[]
}
export interface HeroTranslations {
  title1: string
  title2: string
  description: string
  button: string
  notification: string
}
export interface HowItWorksTranslations {
  tagline: string
  button: string
  cards: {
    title: string
    text: string
    image: string
    floor?: string
    selected?: string
    forSale?: string
  }[]
}
export interface PricingTranslations {
  tag: string
  name: string
  title: string
  link: string
  hen: string
  saved: string
  buy: string
  item: string
  notAvailable: string
  discount: string
  packageHighlight: string
  romania: StoreItemTranslation[]
  iraq: StoreItemTranslation[]
  items: {
    romania: StoreItemTranslation[]
    iraq: StoreItemTranslation[]
  }
}
export interface StoreTranslations {
  tag: string
  title: string
  link: string
  hen: string
  saved: string
  buy: string
  reinvest: string
  insurance: string
  addInsurance: string
  insured: string
  discountApplied: string
  card: string
  items: {
    romania: StoreItemTranslation[]
    iraq: StoreItemTranslation[]
  }
}
export interface StoreItemTranslation {
  numId: string
  name: string
  description: string
  features: string
  save?: string
}
export interface PresaleTranslations {
  tag: string
  title: string
  cattle: string
  saved: string
  buy: string
  reinvest: string
  discount: string
  items: {
    romania: PresaleItemTransaltion[]
    iraq: PresaleItemTransaltion[]
  }
}
export interface PresaleItemTransaltion {
  numId: string
  name: string
  amount: string
  production: string
  image: string
  description: string
  priceInUsd: string
  features: string
  info: string
  save?: string
}
export interface FaqTranslations {
  heading: {
    title: string
    text: string
    a: string
  }
  faqs: {
    title: string
    text: string
  }[]
}
export interface RoadmapTranslations {
  hero: {
    heading: {
      title: string
      text: string
    }
  }
  short: {
    heading: {
      tag: string
      title: string
    }
    button: string
    items: {
      title: string
      text: string
      date: string
      status: string
      imageUrl: string
      colorful: string
      completed: string
    }[]
  }
  full: {
    title: string
    text: string
    date: string
    status: string
    started: string
    completed: string
  }[]
}
export interface AccountFormTranslations {
  firstName: string
  lastName: string
  avatar: string
  email: string
  phoneNumber: {
    text: string
    description: string
  }
  address: {
    text: string
    description: string
  }
  address2: {
    text: string
    description: string
  }
  province: {
    text: string
    description: string
  }
  city: {
    text: string
    description: string
  }
  postalCode: {
    text: string
    description: string
  }
  dateOfBirth: {
    text: string
    description: string
  }
  language: {
    text: string
    description: string
  }
  button: string
}
export interface NotificationsFormTranslations {
  emailNotifications: string
  notificationAllowed: {
    label: string
    radioGroup: {
      label: string
    }[]
  }
  isMarketingEnabled: {
    label: string
    description: string
  }
  isSecurityEnabled: {
    label: string
    description: string
  }
  button: string
}
export interface DocumentsFormTranslations {
  title: string
  subtitle: string
  complete: {
    title: string
    subtitle: string
  }
  pending: {
    title: string
    subtitle: string
  }
  form: {
    passport: {
      label: string
      description: string
    }
    contract: {
      label: string
      description: string
    }
    button: {
      submit: string
    }
  }
  toast: {
    pending: string
    success: string
    error: string
  }
}
export interface HeaderTranslations {
  Iraq?: string
  total: string
  title: string
  hens: string
  roosters: string
  chicks: string
  cockerels: string
  cattles: string
  heifers: string
  bulls: string
  balance: string
  menu: string
  farm: string
  totalBalance: string
  selectRealm: string
  buttons: {
    manageAccount: string
    farmStore: string
    levels: string
    farmCenter: string
    viewAssets: string
    breeding: string
    history: string
    marketplace: string
    withdraw: string
    signIn: string
    signUp: string
    signOut: string
    feedNow: string
    continue: string
    pricing?: string
    language?: string
    farm?: string
  }
  withdraw: {
    dialog: {
      title: string
      description: string
      pending: string
      completed: string
    }
    form: {
      summary: {
        title: string
        commision: string
        amountIQD: string
        amountUSD: string
      }
      paymentMethod: {
        label: string
        command: {
          placeholder: string
          empty: string
        }
      }
      yolkAmount: {
        label: string
      }
      transactionDetails: {
        label: string
        placeholder: string
      }
      attachments: {
        label: string
      }
      checkbox: {
        label: string
      }
      success?: string
      info: string
      info2: string
      comission: string
      total: string
      button: {
        submit: string
        cancel: string
        close: string
      }
    }
  }
  kyc: {
    dialog: {
      title: string
      description: string
    }
    button: string
  }
  ban: {
    dialog: {
      title: string
      description: string
    }
  }
  Romania?: string
}
export interface TermsTranslations {
  cookiePolicy: {
    h1: string
    updated: string
    h2: string
    ps: string[]
    h3s: string[]
    uls: string[][]
  }
  endUserLicenseAgreement: {
    h1: string
    updated: string
    h2: string
    ps: string[]
    h3s: string[]
    uls: string[][]
  }
  privacyPolicy: {
    h1: string
    updated: string
    h2: string
    ps: string[]
    h3s: string[]
    uls: string[][]
  }
  shippingRefunds: {
    h1: string
    updated: string
    h2: string
    ps: string[]
    h3s: string[]
    uls: string[][]
  }
  termsOfService: {
    h1: string
    updated: string
    h2: string
    ps: string[]
    h3s: string[]
    uls: string[][]
  }
  contact: {
    ul: string[]
    email: string
    phone: string
    link: string
  }
}
export interface YolkPage {
  yolk: string
  yolkTitle: string
  cornTitle: string
  milkTitle: string
  hayTitle: string
  digitalAsset: string
  yourBalance: string
}
export interface FarmPage {
  dailyYield: string
  rewards: string
  daily: string
  food: string
  earned: string
  fed: string
  rentRemaining: string
  poultry: string
  currentPoultryStock: string
  roosters: string
  cattles: string
  cockerels: string
  heifers: string
  farming: string
  hens: string
  growing: string
  chicks: string
  actionCenter: string
  farmOperations: string
  availableRewards: string
  foodNeeded: string
  rewardsAvailable: string
  corn: string
  eggs: string
}
export interface SignIn {
  title: string
  description: string
  codePrompt: string
  emailPlaceholder: string
  sendCodeButton: string
  resendCodeButton: string
  loadingButton: string
  errorInvalidCode: string
  errorExpiredCode: string
  errorGeneric: string
}
export interface Navigation {
  routes: {
    title: string
    url: string
  }[]
  terms?: {
    title: string
    url: string
  }[]
  socials?: {
    title: string
    iconUrl: string
    url: string
  }[]
}
export interface Settings {
  account: {
    title: string
    subtitle: string
    form: {
      firstName: string
      lastName: string
      email: string
      button: string
      province: {
        text: string
      }
      city: {
        text: string
      }
      address: {
        text: string
      }
      address2: {
        text: string
      }
      dateOfBirth: {
        text: string
      }
      phoneNumber: {
        text: string
      }
      postalCode: {
        text: string
      }
    }
  }
  notifications: string
  documents: string
}
export interface MarketplaceTranslations {
  title: string
  description: string
  buyNow: string
  assetDetails: string
  owner: string
  listedBy: string
  remaining: string
  price: string
  totalPrice: string
  timeRemaining: string
  complete: string
  placeBid: string
  makeOffer: string
  farmingProcess: string
  state: string
  growthProgress: string
  dailyRewards: string
  dailyFood: string
  day: string
  incubationProgress: string
  recentSales: string
  activityFeed: string
  noSales: string
  peak: string
  average: string
  volume: string
  analytics: string
  salesActivity: string
  sortBy: string
  topBid: string
  total: string
  items: string
  sales: string
  activity: string
  item: string
  selected: string
  buyFloor: string
  floor: string
  floorPrice: string
  noItems: string
  listed: string
  listingFilters:
    | {
        label: string
        value: "price_asc" | "price_desc" | "createdAt_asc" | "createdAt_desc"
      }[]
    | Record<
        number | string,
        {
          label: string
          value: "price_asc" | "price_desc" | "createdAt_asc" | "createdAt_desc"
        }
      >
}
export interface NotFoundPageTranslations {
  title: string
  heading: string
  description: string
}
export interface LocaleLayoutTranslations {
  title: string
  farm: string
}
export interface LanguageTranslations {
  changeTitle: string
  changeMessage: string
  apply: string
  cancel: string
}
export interface CommonTranslations {
  loading?: string
  back?: string
  success: string
  pending: string
  error: string
  before?: string
  after?: string
  inThePast?: string
}
export interface Auth {
  resendIn: string
  resend: string
  changeEmail: string
  didntReceive: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  country: string
  selectYourCountry: string
  createAccount: string
  signUp: string
  logIn: string
  verifyEmail: string
  signIn: string
  signOut: string
  dontHaveAccount: string
  alreadyHaveAccount: string
}

export interface AccountHistoryTranslations {
  title: string
  tabs: {
    deposits: string
    bonuses: string
    withdrawals: string
    feeding: string
    transactions: string
    marketplace: string
  }
  deposits: {
    table: {
      date: string
      type: string
      item: string
      amount: string
      value: string
      status: string
    }
    empty: string
  }
  bonuses: {
    table: {
      date: string
      item: string
      amount: string
      value: string
      status: string
    }
    empty: string
  }
  withdrawals: {
    table: {
      date: string
      baseAmount: string
      baseCurrency: string
      withdrawAmount: string
      withdrawCurrency: string
      commission: string
      status: string
    }
    empty: string
  }
  feeding: {
    table: {
      date: string
      model: string
      food: string
      reward: string
      netReward: string
      foodUsd: string
      rewardUsd: string
      netUsd: string
    }
    empty: string
  }
  transactions: {
    table: {
      date: string
      type: string
      usd: string
      egg: string
      corn: string
      milk: string
      hay: string
    }
    empty: string
  }
  marketplace: {
    tabs: {
      sold: string
      purchased: string
    }
    table: {
      date: string
      item: string
      price: string
      currency: string
      value: string
      buyer: string
      seller: string
    }
    empty: string
  }
  filters: {
    dateRange: string
    from: string
    to: string
    apply: string
    clear: string
  }
  pagination: {
    previous: string
    next: string
    showing: string
    of: string
  }
}

export interface BreedingTranslations {
  heading: string
  roostersCount: string
  // Stats bar
  totalRoosters: string
  idle: string
  breeding: string
  ready: string
  totalBreeds: string
  yolkBalance: string
  canBreed: string
  // Card
  breedingsCounter: string
  timeRemaining: string
  readyToCollect: string
  // Tabs
  tabAll: string
  tabIdle: string
  tabBreeding: string
  tabReady: string
  // Empty states
  noRoosters: string
  noRoostersCta: string
  emptyIdle: string
  emptyBreeding: string
  emptyReady: string
  // Stats
  breedingCost: string
  breedingDuration: string
  // Actions
  startBreedButton: string
  finishBreedButton: string
  // Toasts
  toasts: {
    startBreed: { pending: string; success: string; error: string }
    finishBreed: { pending: string; success: string; error: string }
  }
  // Bulk actions
  startAllIdle: string
  finishAllReady: string
  bulkStartSelected: string
  bulkFinishSelected: string
  selected: string
  selectAll: string
  deselectAll: string
  // Top-level tabs
  tabRoosters: string
  tabEggs: string
  // Egg section
  egg: {
    // Stats bar
    totalEggs: string
    idle: string
    incubating: string
    ready: string
    incubationCost: string
    yolkBalance: string
    canIncubate: string
    incubationDuration: string
    // Card
    expiresIn: string
    expired: string
    timeRemaining: string
    readyToHatch: string
    // Tabs
    tabAll: string
    tabIdle: string
    tabIncubating: string
    tabReady: string
    // Empty states
    noEggs: string
    noEggsCta: string
    emptyIdle: string
    emptyIncubating: string
    emptyReady: string
    // Actions
    startIncubationButton: string
    finishHatchingButton: string
    // Toasts
    toasts: {
      incubate: { pending: string; success: string; error: string }
      hatch: { pending: string; success: string; error: string }
      incubateSkipped: string
    }
    // Bulk actions
    startAllIdle: string
    finishAllReady: string
    bulkStartSelected: string
    bulkFinishSelected: string
  }
}
export interface SignOut {
  title: string
  description: string
  cancel: string
  button: string
}
// Aggregate type for property-access `t.Namespace.key` autocomplete
export interface T {
  Title?: string
  Assets: AssetsTranslations
  Header: HeaderTranslations
  Pricing: PricingTranslations
  Countdown: CountdownTranslations
  Farm: FarmTranslations
  Contact: ContactTranslations
  Benefits: BenefitsTranslations
  Services: ServicesTranslations
  Join: JoinTranslations
  Collaboration: CollaborationTranslations
  Features: FeaturesTranslations
  Hero: HeroTranslations
  HowItWorks: HowItWorksTranslations
  Store: StoreTranslations
  StoreItem?: StoreItemTranslation
  Presale: PresaleTranslations
  PresaleItem?: PresaleItemTransaltion
  Faq: FaqTranslations
  Roadmap: RoadmapTranslations
  NotFoundPage: NotFoundPageTranslations
  LocaleLayout: LocaleLayoutTranslations
  AccountForm?: AccountFormTranslations
  NotificationsForm?: NotificationsFormTranslations
  DocumentsForm?: DocumentsFormTranslations
  Terms: TermsTranslations
  YolkPage: YolkPage
  FarmPage: FarmPage
  SignIn: SignIn
  Navigation: Navigation
  Settings: Settings
  Marketplace: MarketplaceTranslations
  Common: CommonTranslations
  Auth: Auth
  SignOut: SignOut
  Language: LanguageTranslations
  Breeding: BreedingTranslations
  History: AccountHistoryTranslations
}
