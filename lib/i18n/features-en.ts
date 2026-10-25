import type { FeaturesDictionary } from "./features-ja";

/** English copy for the feature pages. Same shape as features-ja.ts. */
export const featuresEn: FeaturesDictionary = {
  nav: {
    home: "Home",
    features: "Features",
    breadcrumb: "You are here",
  },

  index: {
    metaTitle: "Features",
    metaDescription:
      "Everything PaperLens does: linking slides to the paper, the companion panel (translation, terms, equations), the wordbook and graph, using Claude (MCP), and the paper list and search.",
    title: "Features",
    lead: "One page per feature, each with the real app and how to use it. The app's interface is in Japanese; buttons are shown with their Japanese label and an English gloss.",
    mapKicker: "A map of the app",
    mapTitle: "Switch with the icons on the left edge and the tabs on the right.",
    ribbonTitle: "Icons on the left edge",
    tabsTitle: "Tabs on the right (companion panel)",
    ribbon: [
      { key: "files", label: "Papers", body: "Import papers from a PDF or an arXiv ID, and open them from the list." },
      { key: "search", label: "Search", body: "Searches paper titles and what you've written down: highlight translations and notes, terms, equations. It doesn't search the PDF text or the side-by-side translation." },
      { key: "lists", label: "Lists (terms & equations)", body: "Look up terms and equations from all your papers in the wordbook and equation book." },
      { key: "graph", label: "Graph", body: "See how papers and terms connect." },
      { key: "slides", label: "Slides & paper", body: "Put slides beside the paper and link them with boxes and lines. Then present straight from it with 発表 (Present)." },
      { key: "settings", label: "Settings", body: "Set your Claude API key, vault location, and MCP setup." },
      { key: "help", label: "Help", body: "Guides, FAQ, and keyboard shortcuts." },
    ],
    tabs: [
      { label: "Side by side", body: "The full translation you asked Claude for, each sentence next to the original. Click one to find it in the PDF." },
      { label: "Highlights", body: "Passages you highlighted, with their translations and notes." },
      { label: "Terms", body: "What each term means and how this paper uses it." },
      { label: "Equations", body: "Equations in TeX, with what each symbol means." },
    ],
    tabsMore: "More on the companion panel",
  },

  ui: {
    more: "Learn more",
    stepsTitle: "How it works",
    stepsJump: "See how it works",
    stepLabel: "Step {n}",
    casesTitle: "Good for",
    notesTitle: "Good to know",
    mcpKicker: "MCP",
    mcpTitle: "Claude can do this too",
    mcpMore: "More on using Claude",
    toolsTitle: "Tools by feature",
    toolsLead: "The PaperLens MCP server has 18 read tools and 32 write tools. Here are the main ones, grouped by feature.",
    toolsArea: "Feature",
    toolsNames: "Tools",
    promptsTitle: "Prompt for full translation",
    othersTitle: "Other features",
    ctaTitle: "Try it at your next journal club.",
    ctaBody: "There's no installer yet, and the app's interface is in Japanese for now. You run PaperLens from the source on GitHub.",
    ctaPrimary: "Run from source",
    ctaSecondary: "View on GitHub",
    chatLabel: "Example conversation with Claude",
    chatYou: "You",
    chatClaude: "Claude",
  },

  mcpTools: [
    { area: "Reading papers", tools: ["import_paper", "list_papers", "read_paper_text", "find_in_paper", "get_page_image"] },
    { area: "Side-by-side translation", tools: ["get_sentence_outline", "get_translation_batch", "set_translations", "update_glossary", "search_sentences"] },
    { area: "Terms & equations", tools: ["add_term", "update_term", "add_equation", "update_equation"] },
    { area: "Highlights & notes", tools: ["add_highlight", "update_highlight", "add_sentence_note"] },
    { area: "Slides", tools: ["import_slides", "add_slide_markup", "link_slide_markup", "set_slide_markup_memo"] },
    { area: "Lists & search", tools: ["get_lists", "get_graph", "search_notes", "get_bibtex"] },
  ],
  mcpPrompts: [
    { name: "translate_paper", body: "Translates every sentence into the Side-by-side tab. Terms stay consistent through the glossary, and translations you've edited are never overwritten." },
  ],

  mcpChat: [
    { user: "Translate this whole paper.", prompt: "translate_paper", tool: "set_translations", result: "Done. The Side-by-side tab now has a translation for each sentence." },
    { user: "Explain equation (11).", tool: "add_equation", result: "Added the TeX and each symbol's meaning to the Equations tab." },
    { user: "Look up this term and add it, too.", tool: "add_term", result: "It's in the Terms tab. Use \"Edit\" in the app to change it." },
    { user: "Link Markup-02.01 to where equations (1) and (2) are.", tool: "link_slide_markup", result: "Linked. A line in the group's color now joins the slide and the paper." },
  ],

  pages: {
    "slides-link": {
      metaTitle: "Linking slides to the paper",
      metaDescription:
        "Box part of a slide and join it to a sentence, figure, or equation in the paper. Click either end, and you land on the other. To present, 発表 (Present) puts the slides and paper in their own window and gives you a script.",
      appLabel: "Slides & paper",
      title: "Linking slides to the paper",
      lead: "Box part of a slide and join it to a sentence, figure, or equation in the paper. Click either end, and you land on the other.",
      cardLine: "Join boxes on your slides to passages in the paper, then present from it.",
      heroAlt: "PaperLens with colored lines running from the group Markup-02.01 on a slide to a sentence and an equation in the paper.",
      steps: [
        {
          title: "Import your slides",
          body: "Open \"Slides & paper\" from the left edge and drop in a PDF or PPTX. The slides appear to the left of the paper.",
        },
        {
          title: "Draw a box",
          body: "Choose \"Box\" (R) and drag across the slide. The box becomes a group with a name like Markup-02.01 (page 2, first box).",
          ui: ["囲む (Box) R"],
        },
        {
          title: "Link it to the paper",
          body: "With the group selected, drag over a sentence in the paper and choose \"Link as text\". For figures and equations, box them with \"Figure\" (F) or \"Equation\" (E). A line in the group's color joins the two. One group can link to as many places as you need.",
          ui: ["文章としてリンク (Link as text)", "図 (Figure) F", "数式 (Equation) E"],
        },
        {
          title: "Go back and forth",
          body: "Click a group on a slide, and the paper scrolls to the linked passage. Click the colored marker in the paper, and you're back on that slide.",
          ui: ["選んだ線だけ (Selected lines only)"],
        },
        {
          title: "Press 発表 (Present)",
          body: "When you're ready, press 発表 (Present, P) at the top right. If there are too many lines, 選んだ線だけ (Selected lines only) shows just the lines of the selected group.",
          ui: ["発表 (Present) P", "選んだ線だけ (Selected lines only)"],
        },
        {
          title: "A window to show, a script to read",
          body: "The slides and paper, lines included, open in a separate window that fills the screen. If an external display is connected, the window goes there. Your original window becomes the script.",
          ui: ["発表中 (Presenting)"],
        },
        {
          title: "The audience sees slides and paper",
          body: "The presentation window shows the slides next to the paper, with lines joining each box to its passage.",
        },
        {
          title: "Talk from the script",
          body: "The script lists your slides in order, with each group's memo and the passages it links to. The slide on screen is marked 表示中 (Showing).",
          ui: ["表示中 (Showing)"],
        },
        {
          title: "Steer the presentation from the script",
          body: "Click a slide in the script, and the presentation window moves to it. Click a group, and it shows the linked passage in the paper. ← and → change slides. 発表を終える (End presentation) or P ends it.",
          ui: ["← →", "発表を終える (End presentation)"],
        },
      ],
      chapters: [
        { id: "link", title: "Link and go back and forth", count: 5 },
        {
          id: "present",
          title: "Present",
          count: 4,
          lead: "At journal club, you present with two windows. The audience watches the presentation window, and you read the script. When a question comes up, click the group in the script. The paper on screen moves to the passage behind it.",
        },
      ],
      cases: [
        "Checking that a slide's summary matches the paper",
        "Answering \"what does the paper actually say?\"",
        "Keeping your memos and sources in front of you while you talk",
        "Reading a paper with someone else's slides as a guide",
      ],
      signature: {
        title: "Either end takes you to the other.",
        lead: "Links aren't one-way. Click on the slide or in the paper, and the other side opens.",
        items: [
          { label: "Slide → paper", body: "Click a group, and the paper scrolls to the linked sentence, figure, or equation." },
          { label: "Paper → slide", body: "Click the colored marker in the paper's margin, and that slide opens." },
        ],
      },
      notes: [
        "Importing PPTX needs LibreOffice or Keynote. Without either, export to PDF first and import that.",
        "If a separate window can't open (in a browser, for example), the current view fills the screen instead. Press Esc or P to go back.",
      ],
      mcpLine: "Claude can also draw the groups and links for you.",
    },

    supplement: {
      metaTitle: "The companion panel: translation, terms, equations",
      metaDescription:
        "Tabs for the side-by-side translation, highlights, terms, and equations sit to the right of the paper: what each term means and how the paper uses it, equations in TeX with each symbol explained, and a full sentence-by-sentence translation.",
      appLabel: "Companion panel",
      title: "The companion panel: translation, terms, equations",
      lead: "Tabs for the side-by-side translation, highlights, terms, and equations sit to the right of the paper. Each entry is tied to a place in the paper, and one click takes you there.",
      cardLine: "Terms, equations, and translation, kept beside the paper.",
      heroAlt: "PaperLens with the paper on the left and term cards (meaning, how this paper uses it, related terms) in the companion panel.",
      steps: [
        {
          title: "Open the panel and select text",
          body: "Switch to the companion panel at the top right, and tabs appear beside the paper. Drag over a word or sentence in the PDF: highlight colors appear, along with \"Translate\", \"Look up term\", and \"Make equation\".",
          ui: ["補足情報 (Companion)", "訳す (Translate)", "用語を調べる (Look up term)", "数式にする (Make equation)"],
        },
        {
          title: "Look up a term",
          body: "Choose \"Look up term\", and Claude writes a definition, a longer explanation, how this paper uses it, and related terms. It's added to the Terms tab, and you can edit it later.",
          ui: ["用語を調べる (Look up term)"],
        },
        {
          title: "Transcribe an equation",
          body: "Select an equation and choose \"Make equation\". Claude transcribes it into TeX, renders it, and explains what it does and what each symbol means.",
          ui: ["数式にする (Make equation)"],
        },
        {
          title: "Read side by side",
          body: "The full translation you asked Claude for appears in the Side-by-side tab, one sentence at a time. Click a sentence to find it in the PDF; click a sentence frame in the PDF to find its translation.",
        },
        {
          title: "Use it next to your slides",
          body: "In the slides view, a tab switches to [paper | companion panel]. Click a term's or equation's location, and the paper moves there.",
        },
      ],
      cases: [
        "Reading outside your field, full of unfamiliar terms",
        "Losing track of what the symbols stand for",
        "Checking English phrasing against a translation",
        "Getting term explanations ready before a talk",
      ],
      signature: {
        title: "Every tab points back into the paper.",
        items: [
          { label: "Side by side", body: "The full translation you asked Claude for, each sentence next to the original. Click a sentence to find it in the PDF, or a sentence frame in the PDF to find its translation." },
          { label: "Highlights", body: "Passages you highlighted, with their translations and notes. Click one to jump to it in the PDF." },
          { label: "Terms", body: "Meaning, a longer explanation, how this paper uses it, and related terms. Click the heading to find the term in the PDF." },
          { label: "Equations", body: "The equation in TeX, what it does, and each symbol's meaning. \"Box in PDF\" marks where it is." },
        ],
      },
      notes: [
        "\"Translate\", \"Look up term\", and \"Make equation\" use your Claude API key (billed by usage).",
        "The full translation goes through MCP and needs no API key.",
        "You can write any entry by hand.",
      ],
      mcpLine: "Ask Claude for terms, equations, and the full translation from a conversation.",
    },

    "wordbook-graph": {
      metaTitle: "Wordbook and graph",
      metaDescription:
        "Terms and equations from every paper, gathered in a wordbook and an equation book. Papers that share a term are linked in the graph.",
      appLabel: "Lists (terms & equations) · Graph",
      title: "Wordbook and graph",
      lead: "Terms and equations from every paper, gathered in one place. Papers that share a term are linked in the graph.",
      cardLine: "Terms and equations you look up follow you across papers.",
      heroAlt: "The wordbook window: lists (wordbook, equation book) and papers on the left, terms with their meanings and page numbers on the right.",
      steps: [
        {
          title: "Open Lists",
          body: "Click \"Lists (terms & equations)\" on the left edge (⌘/Ctrl + Shift + L). Terms from all your papers appear in the wordbook.",
          ui: ["⌘/Ctrl + Shift + L"],
        },
        {
          title: "Search and sort",
          body: "Type in the search box to narrow the list. Switch between paper-and-page order and alphabetical order. Switch to the equation book to see every equation you've transcribed, grouped by paper.",
          ui: ["論文・ページ順 (Paper & page)", "五十音・ABC順 (A–Z)", "数式帳 (Equation book)"],
        },
        {
          title: "Jump to the page",
          body: "Click an entry's page number to open the paper at that page.",
          ui: ["p.1"],
        },
        {
          title: "Open the graph",
          body: "Open \"Graph\" from the left edge to see papers and terms joined by lines. Papers that use the same term connect through it and drift close together.",
        },
        {
          title: "Select a term or a paper",
          body: "Select a term to see its meaning and the papers that use it. Select a paper to get \"Open this paper\".",
          ui: ["出てくる論文 (Papers that use it)", "この論文を開く (Open this paper)"],
        },
      ],
      chapters: [
        { id: "wordbook", title: "Wordbook and equation book", count: 3 },
        { id: "graph", title: "Graph", count: 2 },
      ],
      cases: [
        "Finding a term you looked up in an earlier paper",
        "Revisiting every paper that uses the same term",
        "Reviewing a field's vocabulary before a seminar",
      ],
      notes: ["The graph connects papers through the terms you looked up (the Terms tab). It doesn't include the translation glossary."],
      mcpLine: "Claude can read the wordbook and the graph, too.",
    },

    mcp: {
      metaTitle: "Using Claude (MCP)",
      metaDescription:
        "Register PaperLens as an MCP server, and Claude Desktop or Claude Code can work in it. What you ask for ends up in the app's translation, terms, equations, and notes.",
      appLabel: "Using Claude (MCP)",
      title: "Using Claude (MCP)",
      lead: "Work in PaperLens from a conversation with Claude. What you ask for ends up in the app's translation, terms, equations, and notes.",
      cardLine: "Ask Claude, and the result lands in the app.",
      heroAlt: "",
      steps: [
        {
          title: "Register",
          body: "Settings → \"AI agents (MCP)\" shows the setup for this computer. Click \"Copy\" and paste it into Claude Desktop or Claude Code.",
          ui: ["AI エージェント（MCP） (AI agents)", "コピーする (Copy)"],
        },
        {
          title: "Ask for a full translation",
          body: "Say \"Translate [paper title] in PaperLens.\" Translations fill the Side-by-side tab, sentence by sentence.",
        },
        {
          title: "Ask about equations and terms",
          body: "Say \"explain equation (3)\" or \"look up this term.\" Claude reads the text and the page image, writes it up, and adds it to the Equations or Terms tab.",
        },
        {
          title: "Keep the conversation",
          body: "After asking Claude about the paper, say \"save that as a note here.\" It's attached as a note to the sentence, the highlight, or the slide group.",
        },
        {
          title: "Check it in the app",
          body: "If the app is open, Claude's changes appear right away. You can edit anything it writes.",
        },
      ],
      cases: [
        "Translating a long paper in one go",
        "Keeping what you discussed with Claude next to the paper",
        "Having Claude draw groups and links across your slides",
      ],
      notes: [
        "It works even when the app isn't running.",
        "\"Read-only\" in Settings stops Claude from writing.",
        "Text and page images that Claude reads are sent to Claude.",
      ],
      mcpLine: "",
    },

    "library-search": {
      metaTitle: "Papers and search",
      metaDescription:
        "Import and open papers from \"Papers\" on the left edge. \"Search\" looks through paper titles and what you've written down: highlight translations and notes, terms, equations.",
      appLabel: "Papers · Search",
      title: "Papers and search",
      lead: "Import and open papers from \"Papers\" on the left edge. \"Search\" looks through paper titles and what you've written down.",
      cardLine: "Import papers, open them from the list, and search what you've written down.",
      heroAlt: "The paper list on the left, with search, sorting, and paper titles with tags.",
      steps: [
        {
          title: "Import a paper",
          body: "Open \"Papers\" and drop in a PDF. You can also import from a URL or an arXiv ID. For arXiv, the title, authors, and year are filled in for you.",
        },
        {
          title: "Filter and open",
          body: "Type a title, author, year, or tag into the search box above the list (\"#tag\" for tags only). Sort by date added, title, or year. Click a paper to open it where you left off.",
          ui: ["#tag"],
        },
        {
          title: "Export BibTeX",
          body: "\"Export all BibTeX\" writes out every paper in the list. While a filter is on, it exports only the papers shown.",
          ui: ["すべての BibTeX を書き出す (Export all BibTeX)"],
        },
        {
          title: "Search what you wrote down",
          body: "\"Search\" on the left edge looks through paper titles and what you've written down: highlight translations and notes, terms, equations. Click a result to open that paper on the matching tab.",
        },
      ],
      chapters: [
        { id: "library", title: "Papers", count: 3 },
        { id: "search", title: "Search", count: 1 },
      ],
      cases: [
        "Opening a paper you read before, by title or author",
        "Finding which paper a term came from",
        "Collecting references for a talk as BibTeX",
      ],
      notes: [
        "Search doesn't look through the PDF text or the translated sentences. To find a sentence, use the search inside the Side-by-side tab.",
      ],
      mcpLine: "Claude can import papers, list them, and search what you've written down.",
    },
  },
};
