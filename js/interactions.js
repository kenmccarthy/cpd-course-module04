/* ==========================================================================
   Assessment that Works — course interactions
   Each widget is a self-contained block and a no-op if its markup is absent.
   All of them emit tracking events through the Course event bus, so SCORM and
   analytics pick them up without any extra wiring.

   Generic, reusable widgets (knowledge checks, reflections, matching, tabs,
   accordion) live in js/app.js. This file holds the shell's optional widgets
   (checklist, scenario chooser — neither used by this course) and the two
   built for this script: reveal cards and the echo of an earlier answer.
   ========================================================================== */
(function () {
  "use strict";
  var C = window.Course;
  var $ = C.$, $$ = C.$$;
  var emit = C.emit, state = C.state;

  /* ==========================================================================
     Reveal cards — select a card to reveal what is on its back. Used both for
     a row of cards and, with the .matrix wrapper, for a 2x2 grid whose four
     quadrants start unlabelled. Generic: one block per [data-flip], keyed by the
     attribute's value, emitting "<value>-flip".

     Cards stay readable without a mouse: each is a real <button> with
     aria-expanded, and the hidden face is genuinely hidden until it opens, so a
     screen reader hears the front first and the back once it is revealed.
     "Seen" is sticky — closing a card again doesn't un-see it — and is saved, so
     returning to the page restores what the learner had already opened.

     Markup: <div class="flipgrid flipgrid--3" data-flip="KEY" role="group" aria-label="…">
               <button class="flip" type="button" aria-expanded="false">
                 <span class="flip__front">…</span>
                 <span class="flip__hint">Select to reveal</span>
                 <span class="flip__back" hidden>…</span>
               </button>
     ========================================================================== */
  $$("[data-flip]").forEach(function (wrap) {
    var key = wrap.getAttribute("data-flip") || "flip";
    var cards = $$(".flip", wrap);
    if (!cards.length) return;

    var seen = ((state.interactions[key + "-flip"] || {}).seen) || {};

    function setOpen(card, on) {
      card.setAttribute("aria-expanded", on ? "true" : "false");
      card.classList.toggle("is-open", on);
      var back = $(".flip__back", card), hint = $(".flip__hint", card);
      if (back) back.hidden = !on;
      if (hint) hint.hidden = on;
    }

    // Restore what was already opened, without re-firing the event.
    cards.forEach(function (card, i) { if (seen[i]) setOpen(card, true); });

    cards.forEach(function (card, i) {
      card.addEventListener("click", function () {
        var on = card.getAttribute("aria-expanded") !== "true";
        setOpen(card, on);
        if (!on) return;
        seen[i] = true;
        state.interactions[key + "-flip"] = { seen: seen };
        C.saveSoon();
        emit("interaction.complete", {
          id: key + "-flip", card: i, seenCount: Object.keys(seen).length, of: cards.length
        });
      });
    });
  });

  /* ==========================================================================
     Echo — show the learner something they wrote earlier. Generic: one block per
     [data-echo], whose value is the data-reflect id to read back. Written with
     textContent, never innerHTML, so nothing a learner types can inject markup.
     Reads live state, so it works even if "Save note" was never pressed.

     Markup: <div class="echo" data-echo="REFLECT_ID">
               <span class="echo__k">…</span><p class="echo__text"></p></div>
     ========================================================================== */
  $$("[data-echo]").forEach(function (box) {
    var id = box.getAttribute("data-echo");
    var out = $(".echo__text", box);
    if (!id || !out) return;
    function render() {
      var text = (state.reflections[id] || "").trim();
      box.classList.toggle("is-empty", !text);
      out.textContent = text ||
        "You didn\u2019t write an answer at the start \u2014 that\u2019s fine. Think of one assessment that worked well, and what made it work.";
    }
    render();
    C.on("reflection.save", render);
    C.on("section.view", render);
  });

  /* ==========================================================================
     Checklist — a tickable self-audit with a progress ring. Generic: one block
     per [data-checklist], keyed by the attribute's value, emitting
     "<value>-checklist". The message shown under the ring comes from data-msgs
     (one message per score, 0..n, separated by "|").

     Markup:
       <div class="widget checklist" data-checklist="KEY"
            data-msgs="none yet|one|two|three|all four">
         <div class="checklist__grid">
           <label class="check"><input type="checkbox"> <span>…</span></label>
         </div>
         <div class="checklist__meter">
           <div class="checklist__ring" data-ring><span data-score>0/4</span></div>
           <p class="checklist__msg" data-msg role="status">none yet</p>
         </div>
       </div>
     ========================================================================== */
  $$("[data-checklist]").forEach(function (wrap) {
    var key = wrap.getAttribute("data-checklist") || "checklist";
    var boxes = $$('input[type="checkbox"]', wrap);
    var ring = $("[data-ring]", wrap), scoreEl = $("[data-score]", wrap), msg = $("[data-msg]", wrap);
    if (!boxes.length || !ring) return;

    var msgs = (wrap.getAttribute("data-msgs") || "").split("|");
    var touched = false;

    var saved = (state.interactions[key + "-checklist"] || {}).checked || [];
    boxes.forEach(function (b, i) { if (saved[i]) b.checked = true; });

    function render() {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      scoreEl.textContent = n + "/" + boxes.length;
      ring.style.setProperty("--pct", (n / boxes.length) * 100 + "%");
      ring.classList.toggle("full", n === boxes.length);
      if (msg && msgs[n]) msg.textContent = msgs[n];
      state.interactions[key + "-checklist"] = {
        checked: boxes.map(function (b) { return b.checked; }), score: n
      };
      C.saveSoon();
    }

    boxes.forEach(function (b) {
      b.addEventListener("change", function () {
        render();
        if (!touched) { touched = true; emit("interaction.complete", { id: key + "-checklist" }); }
      });
    });
    render();
  });

  /* ==========================================================================
     Scenario chooser — a situation with several approaches, each carrying its
     own trade-off feedback. Deliberately NOT scored: learners are encouraged to
     open every option and compare, so "explored" counts options seen. Generic:
     one block per [data-scenario], emitting "<value>-scenario".

     Markup:
       <div class="widget scenario" data-scenario="KEY">
         <p class="scenario__setup">…the situation…</p>
         <div class="scenario__opts">
           <button class="scenario__opt" data-verdict="good|mixed|poor"
                   data-feedback="what this trades off">
             <span class="scenario__opt-k" aria-hidden="true">A</span>
             <span>…the approach…</span>
           </button>
         </div>
         <div class="scenario__fb" role="status"></div>
       </div>
     ========================================================================== */
  $$("[data-scenario]").forEach(function (wrap) {
    var key = wrap.getAttribute("data-scenario") || "scenario";
    var opts = $$(".scenario__opt", wrap);
    var fb = $(".scenario__fb", wrap);
    if (!opts.length || !fb) return;

    var saved = state.interactions[key + "-scenario"] || {};
    var seen = saved.seen || {};

    var VERDICT = {
      good:  { icon: "check-circle", label: "Strong choice" },
      mixed: { icon: "scale",        label: "Workable, with trade-offs" },
      poor:  { icon: "warning",      label: "High risk" }
    };

    function show(opt) {
      var verdict = opt.getAttribute("data-verdict") || "mixed";
      var v = VERDICT[verdict] || VERDICT.mixed;
      opts.forEach(function (o) { o.classList.toggle("is-chosen", o === opt); });
      opt.classList.add("is-seen");
      fb.className = "scenario__fb show is-" + verdict;
      fb.innerHTML = '<p class="scenario__verdict">' + C.icon(v.icon) + " <strong>" + v.label + "</strong></p>" +
        "<p>" + opt.getAttribute("data-feedback") + "</p>";

      var i = opts.indexOf(opt);
      seen[i] = true;
      state.interactions[key + "-scenario"] = { seen: seen };
      C.saveSoon();
      emit("interaction.complete", {
        id: key + "-scenario", choice: i, verdict: verdict,
        seenCount: Object.keys(seen).length, of: opts.length
      });
    }

    // Restore which options were already opened, without re-firing the event.
    opts.forEach(function (o, i) { if (seen[i]) o.classList.add("is-seen"); });

    opts.forEach(function (o) {
      o.addEventListener("click", function () { show(o); });
    });
  });
})();
