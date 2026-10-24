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
      "Everything PaperLens does: linking slides to the paper, the companion panel (translation, terms, equations), the wordbook and graph, working with Claude via MCP, and the paper list and search.",
    title: "Features",
    lead: "One page per feature. Each one shows the real app and walks through how to use it.",
    mapKicker: "A map of the app",
    mapTitle: "Switch with the icons on the left edge and the tabs on the right.",
    ribbonTitle: "Icons on the left edge",
    tabsTitle: "Tabs on the right (companion panel)",
    ribbon: [
      { key: "files", label: "Papers", body: "Import papers from a PDF or an arXiv ID, and open them from the list." },
      { key: "search", label: "Search", body: "Search paper titles and everything you've written down: translations, notes, terms, equations." },
      { key: "lists", label: "Lists (terms & equations)", body: "Look up terms and equations from all your papers in the wordbook and equation book." },
      { key: "graph", label: "Graph", body: "See how papers and terms connect." },
      { key: "slides", label: "Slides & paper", body: "Put slides beside the paper and link them with boxes and lines." },
      { key: "settings", label: "Settings", body: "Set your Claude API key, vault location, and MCP setup." },
      { key: "help", label: "Help", body: "Guides, FAQ, and keyboard shortcuts." },
    ],
    tabs: [
      { label: "Translation (side by side)", body: "Every sentence, original and translation together. Click one to find it in the PDF." },
      { label: "Translation (selection)", body: "Translations and highlights for passages you selected." },
      { label: "Terms", body: "What each term means and how this paper uses it." },
      { label: "Equations", body: "Equations in TeX, with what each symbol means." },
    ],
    tabsMore: "More on the companion panel",
  },

  ui: {
    more: "Learn more",
    stepsTitle: "How it works",
    stepLabel: "Step {n}",
    casesTitle: "Good for",
    notesTitle: "Notes",
    mcpKicker: "MCP",
    mcpTitle: "Claude can do this too",
    mcpMore: "More on using Claude",
    toolsTitle: "Tools by feature",
    toolsLead: "The PaperLens MCP server has 18 read tools and 32 write tools. Here are the main ones, grouped by feature.",
    toolsArea: "Feature",
    toolsNames: "Tools",
    promptsTitle: "Built-in prompts",
    relatedTitle: "Related features",
    pagerLabel: "More features",
    prev: "Previous",
    next: "Next",
    ctaTitle: "Try it at your next journal club.",
    ctaBody: "There's no installer yet. For now, you run PaperLens from the source on GitHub.",
    ctaPrimary: "Run from source",
    ctaSecondary: "View on GitHub",
    chatLabel: "Example conversation with Claude",
    chatYou: "You",
    chatClaude: "Claude",
  },

  mcpTools: [
    { area: "Reading papers", tools: ["import_paper", "list_papers", "read_paper_text", "find_in_paper", "get_page_image"] },
    { area: "Translation", tools: ["get_sentence_outline", "get_translation_batch", "set_translations", "update_glossary", "search_sentences"] },
    { area: "Terms & equations", tools: ["add_term", "update_term", "add_equation", "update_equation"] },
    { area: "Highlights & notes", tools: ["add_highlight", "update_highlight", "add_sentence_note"] },
    { area: "Slides", tools: ["import_slides", "add_slide_markup", "link_slide_markup", "set_slide_markup_memo"] },
    { area: "Lists & search", tools: ["get_lists", "get_graph", "search_notes", "get_bibtex"] },
  ],
  mcpPrompts: [
    { name: "translate_paper", body: "Translates every sentence and fills the Translation tab." },
    { name: "read_paper", body: "Reads through the paper and adds terms and equations." },
    { name: "review_notes", body: "Looks back over what you wrote down for papers you've read." },
  ],

  mcpChat: [
    { user: "Are you connected to PaperLens?", tool: "get_settings", result: "Connected. I can read the papers in your vault." },
    { user: "Translate this whole paper.", tool: "set_translations", result: "Filling the Translation tab, one sentence at a time." },
    { user: "Explain equation (11).", tool: "add_equation", result: "Put the TeX and what each symbol means in the Equations tab." },
    { user: "Save that explanation as a note on this slide group.", tool: "set_slide_markup_memo", result: "Added a note to Markup-02.01." },
    { user: "Look up this term and add it, too.", tool: "add_term", result: "It's in the Terms tab. Use \"Edit\" in the app to change it." },
  ],

  pages: {
    "slides-link": {
      metaTitle: "Linking slides to the paper",
      metaDescription:
        "Box part of a slide and join it to a sentence, figure, or equation in the paper. Click either end, and you land on the other. Built for preparing and presenting at journal club.",
      appLabel: "Slides & paper",
      title: "Linking slides to the paper",
      lead: "Box part of a slide and join it to a sentence, figure, or equation in the paper. Click either end, and you land on the other.",
      cardLine: "Join boxes on your slides to passages in the paper with colored lines.",
      steps: [
        {
          title: "Import your slides",
          body: "Open \"Slides & paper\" from the left edge and drop in a PDF or PPTX. The slides appear to the left of the paper.",
        },
        {
          title: "Draw a box",
          body: "Choose \"Box\" (R) and drag across the slide. The box becomes a group with a name like Markup-03.02.",
          ui: ["Box R"],
        },
        {
          title: "Link it to the paper",
          body: "With the group selected, drag over a sentence in the paper and choose \"Link as text\". For figures and equations, box them with \"Figure\" (F) or \"Equation\" (E). A line in the group's color joins the two. One group can link to as many places as you need.",
          ui: ["Link as text", "Figure F", "Equation E"],
        },
        {
          title: "Go back and forth",
          body: "Click a group on a slide, and the paper scrolls to the linked passage. Click the colored marker in the paper, and you're back on that slide.",
          ui: ["Selected lines only"],
        },
        {
          title: "Present from it",
          body: "Press \"Full screen\" (P) to show slides and paper, lines included. When a question comes up, click the group and show the original text.",
          ui: ["Full screen P"],
        },
      ],
      cases: [
        "Checking that a slide's summary matches the paper",
        "Answering \"what does the paper actually say?\"",
        "Reading a paper with someone else's slides as a guide",
        "Pointing to where a figure came from",
      ],
      notes: ["PPTX files are converted with LibreOffice or Keynote. Without either, export to PDF first."],
      mcpLine: "Claude can also draw the groups and links for you.",
    },

    supplement: {
      metaTitle: "The companion panel: translation, terms, equations",
      metaDescription:
        "Everything you need to read the paper, kept beside it: what each term means and how the paper uses it, equations in TeX with each symbol explained, and a full sentence-by-sentence translation. Each entry is tied to a place in the paper.",
      appLabel: "Companion panel",
      title: "The companion panel: translation, terms, equations",
      lead: "Everything you need to read the paper, kept beside it. Each entry is tied to a place in the paper, and one click takes you there.",
      cardLine: "Terms, equations, and translation, kept beside the paper.",
      steps: [
        {
          title: "Select text",
          body: "Drag over a word or sentence in the PDF. Highlight colors appear, along with \"Translate\", \"Look up term\", and \"Make equation\".",
          ui: ["Translate", "Look up term", "Make equation"],
        },
        {
          title: "Look up a term",
          body: "Choose \"Look up term\" to get a definition, a longer explanation, how this paper uses it, and related terms. It's added to the Terms tab, and you can edit it later.",
          ui: ["Look up term"],
        },
        {
          title: "Transcribe an equation",
          body: "Select an equation and choose \"Make equation\". It's rendered from TeX, with a note on what it does and what each symbol means.",
          ui: ["Make equation"],
        },
        {
          title: "Read side by side",
          body: "The full translation you asked Claude for appears in the Translation tab, one sentence at a time. Click a sentence to find it in the PDF; click a sentence frame in the PDF to find its translation.",
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
      notes: [
        "\"Translate\", \"Look up term\", and \"Make equation\" work once you add a Claude API key in Settings (billed by usage). The full translation isn't a button in the app; you ask Claude for it via MCP. You can always write entries yourself.",
      ],
      mcpLine: "Ask Claude for terms, equations, and the full translation from a conversation.",
    },

    "wordbook-graph": {
      metaTitle: "Wordbook and graph",
      metaDescription:
        "Terms and equations from every paper, gathered in a wordbook and an equation book. Papers that share a term are linked in the graph.",
      appLabel: "Lists & graph",
      title: "Wordbook and graph",
      lead: "Terms and equations from every paper, gathered in one place. Papers that share a term are linked in the graph.",
      cardLine: "Terms and equations you look up carry across papers.",
      steps: [
        {
          title: "Open Lists",
          body: "Click \"Lists\" on the left edge (⌘/Ctrl + Shift + L). Terms from all your papers appear in the wordbook.",
          ui: ["⌘/Ctrl + Shift + L"],
        },
        {
          title: "Search and sort",
          body: "Type in the search box to narrow the list. Switch between paper-and-page order and alphabetical order.",
          ui: ["Paper & page", "A–Z"],
        },
        {
          title: "Jump to the page",
          body: "Click an entry's page number to open the paper at that page.",
          ui: ["p.1"],
        },
        {
          title: "Browse the equation book",
          body: "Switch to the equation book to see every equation you've transcribed, grouped by paper.",
        },
        {
          title: "Follow the graph",
          body: "Open \"Graph\" from the left edge to see papers and terms joined by lines. Papers that share terms drift close together. Select a term to see its meaning and the papers that use it; select a paper to open it.",
          ui: ["Papers that use it", "Open this paper"],
        },
      ],
      cases: [
        "Finding a term you looked up in an earlier paper",
        "Revisiting every paper that uses the same term",
        "Reviewing a field's vocabulary before a seminar",
      ],
      notes: ["The wordbook and equation book are available in the server and desktop versions."],
      mcpLine: "Claude can read the wordbook and the graph, too.",
    },

    mcp: {
      metaTitle: "Working with Claude (MCP)",
      metaDescription:
        "Register PaperLens as an MCP server, and Claude Desktop or Claude Code can work in it. What you ask for ends up in the app's translation, terms, equations, and notes.",
      appLabel: "With Claude (MCP)",
      title: "Working with Claude (MCP)",
      lead: "Work in PaperLens from a conversation with Claude. What you ask for ends up in the app's translation, terms, equations, and notes.",
      cardLine: "Ask Claude, and the result lands in the app.",
      steps: [
        {
          title: "Register",
          body: "Settings → \"AI agents (MCP)\" shows the setup for this computer. Click \"Copy\" and paste it into Claude Desktop or Claude Code.",
          ui: ["AI agents (MCP)", "Copy"],
        },
        {
          title: "Ask for a full translation",
          body: "Say \"translate the paper ○○ in PaperLens.\" Translations fill the Translation tab, sentence by sentence.",
        },
        {
          title: "Ask about equations and terms",
          body: "Say \"explain equation (3)\" or \"look up this term.\" Claude reads the page, writes it up, and adds it to the Equations or Terms tab.",
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
      notes: ["It works even when the app isn't running. A read-only mode is available. Text that Claude reads is sent to Claude."],
      mcpLine: "",
    },

    "library-search": {
      metaTitle: "Papers and search",
      metaDescription:
        "Import and open papers from \"Papers\" on the left edge. \"Search\" looks through paper titles and the translations, notes, terms, and equations you've written down.",
      appLabel: "Papers · Search",
      title: "Papers and search",
      lead: "Import and open papers from \"Papers\" on the left edge. \"Search\" looks through paper titles and what you've written down.",
      cardLine: "The list you import and open papers from, and search over what you wrote down.",
      steps: [
        {
          title: "Import a paper",
          body: "Open \"Papers\" and drop in a PDF. You can also import from a URL or an arXiv ID. For arXiv, the title, authors, and year are filled in for you.",
        },
        {
          title: "Filter the list",
          body: "Type a title, author, year, or tag into the search box above the list. Type \"#tag\" to filter by tag.",
          ui: ["#tag"],
        },
        {
          title: "Sort and open",
          body: "Sort by date added, title, or year. Click a paper to open it where you left off.",
        },
        {
          title: "Export BibTeX",
          body: "\"Export all BibTeX\" writes out every paper in the list. While a filter is on, it exports only the papers shown.",
          ui: ["Export all BibTeX"],
        },
        {
          title: "Search what you wrote down",
          body: "\"Search\" on the left edge looks through paper titles and the translations, notes, terms, and equations you've written down. Click a result to open that paper on the matching tab.",
        },
      ],
      cases: [
        "Opening a paper you read before, by title or author",
        "Finding which paper a term came from",
        "Collecting references for a talk as BibTeX",
      ],
      notes: [
        "Search doesn't look through the PDF text or the translated sentences. To find a sentence, use the search inside the Translation tab.",
        "Importing from a URL or arXiv works in the server and desktop versions.",
      ],
      mcpLine: "Claude can import papers, list them, and search what you've written down.",
    },
  },
};
