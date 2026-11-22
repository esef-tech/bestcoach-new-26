// UI translations for the Bestcoach navbar + page chrome.
// Add more keys here and to each language as the app grows.

export type Lang = "en" | "fr" | "de" | "ja" | "pt" | "es" | "zh";

export type Dict = {
  nav: {
    home: string;
    community: string;
    shop: string;
    team: string;
    events: string;
    company: string;
    aboutUs: string;
    careers: string;
    contact: string;
    tlp: string;
    theLoyaltyProject: string;
    support: string;
    helpCenter: string;
    subscriptionPlans: string;
    partnerSolutions: string;
    login: string;
    loginToAccess: string;
    bestcoachPlatform: string;
    tlpPlatform: string;
    language: string;
    toggleDark: string;
    openMenu: string;
    openCart: string;
    openAccount: string;
    myProfile: string;
    editProfile: string;
    logOut: string;
    signIn: string;
    signUp: string;
  };
};

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  fr: "French",
  de: "German",
  ja: "Japanese",
  pt: "Portuguese",
  es: "Spanish",
  zh: "Chinese",
};

export const LANG_CODES: Lang[] = ["en", "fr", "de", "ja", "pt", "es", "zh"];

export const translations: Record<Lang, Dict> = {
  en: {
    nav: {
      home: "Home", community: "Community", shop: "Shop", team: "Team",
      events: "Events", company: "Company", aboutUs: "About Us", careers: "Careers",
      contact: "Contact", tlp: "TLP", theLoyaltyProject: "The Loyalty Project",
      support: "Support", helpCenter: "Help Center", subscriptionPlans: "Subscription Plans",
      partnerSolutions: "Partner Solutions", login: "Login", loginToAccess: "Login to access",
      bestcoachPlatform: "Bestcoach Music Platform", tlpPlatform: "The Loyalty Project Platform",
      language: "English", toggleDark: "Toggle dark mode", openMenu: "Open menu",
      openCart: "Open cart", openAccount: "Open account menu", myProfile: "My Profile",
      editProfile: "Edit Profile", logOut: "Log out", signIn: "Sign In", signUp: "Sign Up",
    },
  },
  fr: {
    nav: {
      home: "Accueil", community: "Communauté", shop: "Boutique", team: "Équipe",
      events: "Événements", company: "Entreprise", aboutUs: "À propos", careers: "Carrières",
      contact: "Contact", tlp: "TLP", theLoyaltyProject: "Le Projet Loyauté",
      support: "Support", helpCenter: "Centre d'aide", subscriptionPlans: "Plans d'abonnement",
      partnerSolutions: "Solutions partenaires", login: "Connexion", loginToAccess: "Connectez-vous pour accéder",
      bestcoachPlatform: "Plateforme Bestcoach Music", tlpPlatform: "Plateforme Le Projet Loyauté",
      language: "French", toggleDark: "Basculer le mode sombre", openMenu: "Ouvrir le menu",
      openCart: "Ouvrir le panier", openAccount: "Ouvrir le menu du compte", myProfile: "Mon profil",
      editProfile: "Modifier le profil", logOut: "Déconnexion", signIn: "Se connecter", signUp: "S'inscrire",
    },
  },
  de: {
    nav: {
      home: "Startseite", community: "Community", shop: "Shop", team: "Team",
      events: "Events", company: "Unternehmen", aboutUs: "Über uns", careers: "Karriere",
      contact: "Kontakt", tlp: "TLP", theLoyaltyProject: "Das Treueprojekt",
      support: "Support", helpCenter: "Hilfecenter", subscriptionPlans: "Abonnementpläne",
      partnerSolutions: "Partnerlösungen", login: "Anmelden", loginToAccess: "Anmelden für Zugriff",
      bestcoachPlatform: "Bestcoach Music Plattform", tlpPlatform: "Das Treueprojekt Plattform",
      language: "German", toggleDark: "Dunkelmodus umschalten", openMenu: "Menü öffnen",
      openCart: "Warenkorb öffnen", openAccount: "Kontomenü öffnen", myProfile: "Mein Profil",
      editProfile: "Profil bearbeiten", logOut: "Abmelden", signIn: "Anmelden", signUp: "Registrieren",
    },
  },
  ja: {
    nav: {
      home: "ホーム", community: "コミュニティ", shop: "ショップ", team: "チーム",
      events: "イベント", company: "会社", aboutUs: "私たちについて", careers: "採用",
      contact: "お問い合わせ", tlp: "TLP", theLoyaltyProject: "ロイヤルティプロジェクト",
      support: "サポート", helpCenter: "ヘルプセンター", subscriptionPlans: "サブスクリプションプラン",
      partnerSolutions: "パートナーソリューション", login: "ログイン", loginToAccess: "アクセスするにはログイン",
      bestcoachPlatform: "Bestcoach Music プラットフォーム", tlpPlatform: "ロイヤルティプロジェクトプラットフォーム",
      language: "Japanese", toggleDark: "ダークモード切り替え", openMenu: "メニューを開く",
      openCart: "カートを開く", openAccount: "アカウントメニューを開く", myProfile: "マイプロフィール",
      editProfile: "プロフィール編集", logOut: "ログアウト", signIn: "ログイン", signUp: "登録",
    },
  },
  pt: {
    nav: {
      home: "Início", community: "Comunidade", shop: "Loja", team: "Equipe",
      events: "Eventos", company: "Empresa", aboutUs: "Sobre nós", careers: "Carreiras",
      contact: "Contato", tlp: "TLP", theLoyaltyProject: "O Projeto Fidelidade",
      support: "Suporte", helpCenter: "Central de ajuda", subscriptionPlans: "Planos de assinatura",
      partnerSolutions: "Soluções para parceiros", login: "Entrar", loginToAccess: "Entre para acessar",
      bestcoachPlatform: "Plataforma Bestcoach Music", tlpPlatform: "Plataforma O Projeto Fidelidade",
      language: "Portuguese", toggleDark: "Alternar modo escuro", openMenu: "Abrir menu",
      openCart: "Abrir carrinho", openAccount: "Abrir menu da conta", myProfile: "Meu perfil",
      editProfile: "Editar perfil", logOut: "Sair", signIn: "Entrar", signUp: "Cadastrar",
    },
  },
  es: {
    nav: {
      home: "Inicio", community: "Comunidad", shop: "Tienda", team: "Equipo",
      events: "Eventos", company: "Empresa", aboutUs: "Sobre nosotros", careers: "Carreras",
      contact: "Contacto", tlp: "TLP", theLoyaltyProject: "El Proyecto de Lealtad",
      support: "Soporte", helpCenter: "Centro de ayuda", subscriptionPlans: "Planes de suscripción",
      partnerSolutions: "Soluciones para socios", login: "Iniciar sesión", loginToAccess: "Inicia sesión para acceder",
      bestcoachPlatform: "Plataforma Bestcoach Music", tlpPlatform: "Plataforma El Proyecto de Lealtad",
      language: "Spanish", toggleDark: "Cambiar modo oscuro", openMenu: "Abrir menú",
      openCart: "Abrir carrito", openAccount: "Abrir menú de cuenta", myProfile: "Mi perfil",
      editProfile: "Editar perfil", logOut: "Cerrar sesión", signIn: "Iniciar sesión", signUp: "Registrarse",
    },
  },
  zh: {
    nav: {
      home: "首页", community: "社区", shop: "商店", team: "团队",
      events: "活动", company: "公司", aboutUs: "关于我们", careers: "招聘",
      contact: "联系", tlp: "TLP", theLoyaltyProject: "忠诚计划",
      support: "支持", helpCenter: "帮助中心", subscriptionPlans: "订阅计划",
      partnerSolutions: "合作伙伴方案", login: "登录", loginToAccess: "登录以访问",
      bestcoachPlatform: "Bestcoach 音乐平台", tlpPlatform: "忠诚计划平台",
      language: "Chinese", toggleDark: "切换深色模式", openMenu: "打开菜单",
      openCart: "打开购物车", openAccount: "打开账户菜单", myProfile: "我的资料",
      editProfile: "编辑资料", logOut: "退出", signIn: "登录", signUp: "注册",
    },
  },
};