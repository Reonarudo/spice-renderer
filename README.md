# spice-renderer

Draw SPICE netlists as circuit schematics — safe, inline-ready SVG — in Node, at build time.
It draws; it never simulates. One of five renderer libraries that share the
[render contract](http://192.168.188.68:3001/projects/markdown-renderers/wiki/Render_contract);
it started as a copy of [SPICE Schematic Preview](https://github.com/Reonarudo/spice-markdown-preview)
and draws what that extension draws.

```sh
npm install github:Reonarudo/spice-renderer#v0.1.0
```

On npm 12 or later, a project installing git dependencies also needs `allow-git=root` in its
`.npmrc`. Nothing runs on install: `dist/` and the parsers are committed.

## Use

```js
import { createRuntime, nodeFileReader, prepare } from '@reonarudo/spice-renderer';

const runtime = await createRuntime();
const reader = nodeFileReader({ root: '/site/content', document: '/site/content/posts/amp.md' });
const prepared = await prepare('.include models/opamps.lib\nX1 inp inn vcc vee out LM358', { reader, dialect: 'ngspice' });
const result = runtime.render(prepared);
await runtime.dispose();
```

Rendering is two steps. `prepare(source, options)` is asynchronous: it reads the fence in its
dialect, finds every file it includes — and the files those include — reads them through the
`reader`, and returns a `Prepared`. `runtime.render(prepared)` is synchronous and returns one of:

| `status` | Fields | When |
| --- | --- | --- |
| `success` | `output`, `notes` | `output` is one `<svg class="spice" viewBox="…">` with no size, ready to inline; `notes` holds what the netlist reader skipped or assumed, as plain text |
| `failure` | `message`, `line?`, `column?` | a netlist error (plain text, 1-based, fence-relative), a preparation failure, or an exceeded limit |
| `timeout` | `budget` | the layout ran past `timeout` milliseconds |
| `unavailable` | `reason` | the layout worker could not start |

`render` throws only for programmer errors: input that `prepare` did not return, or a call
after `dispose()`. `createRuntime` and `prepare` reject only for invalid options.

### Preparation options

| Option | Default | |
| --- | --- | --- |
| `reader` | none | a file reader; needed only when the fence includes files |
| `dialect` | `ngspice` | `ngspice`, `ltspice`, `pspice`, `hspice`, `xyce` or `spectre`, in any case |
| `limits.files` | `32` | distinct files per fence, every level counted |
| `limits.fileBytes` | `8388608` | one file, in bytes; passed to the reader as `maxBytes` |
| `limits.totalBytes` | `16777216` | all of a fence's files together, in bytes |

The consumer resolves the dialect — a fence attribute, else its own default — and passes it;
`DIALECT_NAMES` and `DEFAULT_DIALECT` are exported for validating an attribute. A name that is
not a dialect is a `failure` naming the choices. The dialect is never guessed from the netlist.

A file reader is `{ read(key, { maxBytes }) → Promise<{ bytes } | { error }> }`, where `key`
is the path as written, relative to the Markdown file's folder. One reader serves every fence
of one Markdown file; it is the same interface gnuplot-renderer takes, so one reader serves both.
`nodeFileReader({ root, document })` reads from the local filesystem: only regular files inside
`root`, reached through no symbolic link, no larger than `maxBytes`, and unchanged while they
were read. Its errors never contain a path.

A fence that includes files but is prepared without a reader is a `failure`. A file that
cannot be read, or is over a limit, is not: it is reported where the netlist includes it
(`nowhere.lib could not be read: file not found`, at the `.include`'s line and column), and an
error inside an included file is reported at the fence's include, naming the file and its line
(`In models/amp.lib, line 4: …`).

`prepared.identity` is a sha256 over the fence, the dialect and every included file's key and
content (or its error), with no absolute path: equal identities render equal schematics, on any
machine.

### Runtime options

| Option | Default | |
| --- | --- | --- |
| `timeout` | `3000` | milliseconds per layout |
| `startupTimeout` | `10000` | milliseconds per worker start, never charged to a render |
| `limits.sourceChars` | `64000` | fence body, in string length |
| `limits.outputBytes` | `4194304` | the schematic's SVG, in UTF-8 bytes |

Each must be a finite positive number. Limits can be raised or lowered, never disabled. A
netlist may also have at most 400 elements, which is a property of the drawing, not an option.
Densely connected circuits of a few hundred parts can need more than the default timeout.

### What the consumer does

The consumer does everything presentational:

- wraps the SVG: figure, caption, alt text, the author's class and alignment;
- escapes `message`, `notes` and `reason` when writing them into HTML — and, if it quotes the
  failing line under a caret as the extension does, counts `column` from 1;
- creates one runtime per build or preview, one file reader per Markdown file, and disposes of
  the runtime;
- caches, if it wants to — including remembering that a fence timed out.

## The output

The schematic is black line art on a transparent background: strokes in `#000`, no fills
except junction dots and filled marks, labels in bold 10-unit Courier. Those properties are
**presentation attributes** on the elements, so the SVG draws the same with no stylesheet, and
any stylesheet of the consumer's still overrides them. The classes the extension's stylesheet
used are kept for that: `wire`, `junction`, `symbol`, `connect`, `detail`, and on labels
`nodelabel`, `endlabel`, `title`, `pinlabel`. A schematic is as wide as its circuit; scale it
with CSS (`max-width: 100%; height: auto`). The extension's white card, padding and rounded
corners are presentation and stay with the consumer.

## What is drawn

| Element | Drawn as |
| --- | --- |
| `R`, `C`, `L` | Resistor, capacitor, inductor, with the value |
| `D` | Diode, with its model |
| `V`, `I` | Source: + and − marks, or an arrow from n+ to n− |
| `Q` | NPN or PNP by its `.model`, with the model name |
| `M` | NMOS or PMOS by its `.model`; body drawn if not the source |
| `M` with a `VDMOS` model | Three-pin NMOS or PMOS (`pchan`, `VDMOSP`) |
| `X` | A box titled with the subcircuit, pins named from its `.subckt` |
| `A`, `N` | A box titled with the code model's or Verilog-A model's type, pins numbered |
| `B` `E` `F` `G` `H` `J` `O` `P` `S` `T` `U` `W` `Y` `Z` | A box titled with what it is |

Every element letter ngspice knows is read with the terminals ngspice gives it:
`E`/`G` in their linear, `POLY(n)`, `vol=`/`cur=`/`value=` and `TABLE` forms,
`Q` with substrate and thermal nodes, `M` with three to seven nodes by its
model, `D` with a thermal node, and `X1 (a b) sub` with its nodes in
parentheses.

Every connection to ground (`0` or `gnd`) gets its own ground symbol, and every
connection to a global node (a `.global` name, or `$G_…` in LTspice and PSpice)
its own net label naming the node. A part with no symbol of its own — a
subcircuit, a dependent source, a digital gate, a code model — is a block: a
box titled with what it is, inputs on the left, outputs on the right and supply
pins on the top and bottom edges as the element catalogue places them, with
pins numbered where the netlist cannot know their names. Node names
are case-insensitive, as in SPICE. `+` and `\\` continuation lines, `*`, `#`,
`;`, `$` and `//` comments, and `'…'` and `{…}` expressions work as in ngspice.
Analysis directives such as `.tran` are skipped, as are `.subckt` bodies (which
may nest) and `.control` blocks. The first `.end` ends the netlist; `.if` is not
evaluated, so its first branch is drawn.

The first line of a SPICE file is its title; a fence has none, so start a title
with `*` to make it a comment.

A few things are returned as `notes` rather than drawn: a transistor whose model is not
defined (drawn as NPN or NMOS), a subcircuit that is not defined (pins numbered), substrate
and thermal nodes, `K` coupling, lines after `.end`, and the `.elseif`/`.else` branches of an
`.if`.

## Included files

`.include`, `.inc` and `.lib` read files, as SPICE does, so a model library can decide which
transistors are PNP and name a subcircuit's pins, and a fence can draw a circuit kept in its
own file. `.lib file section` reads one section; `.lib file` alone is an error, as in ngspice.
`.inc` and `.incl` are `.include`. Includes may nest eight deep. Files are read in the fence's
dialect, so which directives include — and whether `.lib file` alone does — follows it. Only
text is read, and only names and elements are taken from it; nothing is run.

## Dialects

In `ltspice`, netlists are read as LTspice 26 reads them: only `*` and `;`
comment (`$G_VDD` is a node, `//` is text), `@` and `&` are the FRA elements,
`A` functions have eight pins, `U` is an RC line, a VDMOS `M` has three pins and
is P-channel by `pchan`, `Z` is an IGBT with an `NIGBT`/`PIGBT` model, `I`/`B`
with `R=` are resistors, `value=` sources have two pins and `Laplace=`/`tbl=`
sources four. `.lib file` reads the whole file for its models and subcircuits
but not its top-level elements; a `.lib` whose file is not next to the document
(`standard.dio`, `UniversalOpAmps2.sub`) is noted and skipped, since LTspice
reads it from its own library folder. Expressions as node names (`{n}`) are
not read.

In `pspice`, netlists are read as PSpice A/D 16.6 reads them: `*`, `;` and `#`
comment (`$G_DPWR` and `$D_HI` are nodes, `//` is text); `B` is a GaAsFET, `Z`
an IGBT, `N` and `O` the digital interfaces and `U` a digital primitive whose
pins follow from its type and arguments (`NAND(2)`, `JKFF(1)`, `PINDLY (5,0,10)`),
two supply pins first; `E`/`G` take two nodes in their `VALUE`, `TABLE`,
`LAPLACE`, `FREQ`, `CHEBYSHEV`, `F=` and `Q=` forms and 2 + 2n after `POLY(n)`,
pairs written `(a,b)` included; a subcircuit's `OPTIONAL:` pins may be left off
a call from the right, and `PARAMS:`/`TEXT:` end its nodes; `[SUB]` names a
substrate node; `.MODEL … AKO:ref type` takes the written type and `LPNP` is a
PNP; `.LIB file` reads a library's models and subcircuits without its top-level
elements, has no sections, and a `.LIB` whose file is not next to the document
(or a bare `.LIB`, meaning `nom.lib`) is noted and skipped; `.ALIASES` blocks
are skipped. Only the first circuit of a file is drawn.

In `hspice`, netlists are read as HSPICE B-2008.09 reads them: `*` lines and `$`
comment — `$` after a blank, a comma or a number, so `1k$note` is `1k` — while
`;` is an ordinary name character and `//` is text; a blank then `\` or `\\` at
the end of a line continues it; `'…'` and `"…"` expressions keep their spaces;
`0`, `GND`, `GND!`, `GROUND` and `!GND` are ground; `B` is an IBIS buffer whose
pins are named by `buffer=`, `S` an n-port with numbered pins, `W` a coupled
lossy line with `N=` conductors (nodes and parameters may be mixed), `U` a lumped
lossy line and `P` a port; `E`/`G` keep four nodes in their `LAPLACE`, `DELAY`,
`POLE`, `FREQ`, `FOSTER`, `OPAMP`, `TRANSFORMER`, `PWL`, `VCR` and `VCCAP` forms,
with a bare `POLY` meaning `POLY(1)`, and two in `VOL=`, `CUR=` and `NOISE=`; `M`
may leave off its bulk and `J` may add one; `R`/`C`/`L` name a model before the
value; a model `nch` is found among `nch.1`, `nch.2`, … (the model selector);
`.MACRO`/`.EOM` define a subcircuit; `.CONNECT` joins two nodes; `.LIB 'file'
entry` reads a section, sections of one file may call each other, and `.LIB file`
alone is an error; `.DATA` blocks and `.PROTECT` text are skipped, and the first
`.ALTER` ends the circuit, both with a note. Only the first simulation of a file
is drawn.

In `xyce`, netlists are read as Xyce 7.10 reads them: `*` lines and `;` comment,
and so is any line that starts with a blank or a tab unless its first non-blank
character is `+` (`$GVDD` is a global node, `//` is text, a trailing `\\` does
not continue a line); only `0` is ground until the netlist says `.PREPROCESS
REPLACEGROUND TRUE`, which makes `GND`, `GND!` and `GROUND` ground too;
`Y<type> <name>` names a device by its type — a memristor, delay, lumped line,
PDE device or n-port by the catalogue, any other type a block titled by it with
numbered pins; `U` is a digital gate with its `DPWR`/`DGND` pins first, `P` a
port, `S … CONTROL=` a two-node switch, and `A`/`N` are not elements; `K` may
couple several inductors and name a core model; `M` takes three nodes with an
MVS model (level 2000), four to seven with BSIM-SOI and is a VDMOS at level 18;
`Q` writes a named substrate as `[SUB]`; `R`/`C`/`L` name a model before the
value; `.INCL` and quoted file names are read, `.LIB file entry` reads a section
and `.LIB file` alone is an error. Only the first circuit of a file is drawn.

In `spectre`, netlists are read as Cadence Spectre reads a `.scs` file: an
instance is `name (nodes) master param=value …` — the parentheses optional, a
second `(…)` group allowed — and the master names the part: a primitive
(`resistor`, `capacitor`, `inductor`, `vsource`, `isource`, `diode`, `bjt`,
`vbic`, `bsim4` and the other MOS families, `bsimsoi`, `jfet`, `gaas`, `vcvs`,
`vccs`, `ccvs`, `cccs` and their `p…` forms, `tline`, `mtline`, `relay`,
`switch`, `iprobe`, `port`, `transformer`, `nport`, `mutual_inductor`), a
`model` whose master and `type=` decide NPN/PNP and N/P, or a `subckt`,
`inline subckt` or Verilog-A module, drawn as a block with the definition's
ports. Names keep their case; `0` is ground, and so is the first name of the
first `global` statement; `//` and `*` lines and a blank then `//` comment; `\`
and `+` continue lines, inside `(…)` and `[…]` too. `include "file"`,
`include "file" section=name` and `#include` are read (a `.scs` file in Spectre,
any other in SPICE mode), `ahdl_include` is noted; `if … { } else { }` draws
its first branch; `sweep` and `montecarlo` blocks are read through,
`statistics`, `paramset` and model bin groups skipped; analyses, `options`,
`info`, `save`, `ic` and `parameters` draw nothing. `simulator lang=spice`
switches the rest of the netlist to SPICE mode — element letters, case folded,
`*spectre:` lines read — until `simulator lang=spectre`, anywhere, inside a
`subckt` too. Not read: `insensitive=yes`, an inline subckt's inner device (the
instance is a block), and a `.model` from a SPICE-mode region named by a
Spectre instance.

<!-- elements-by-dialect: generated by npm run readme:table from src/catalogue/; do not edit -->

<details><summary>Every element type the catalogue knows — 68 of them — and how each dialect spells it</summary>

A letter alone is the whole spelling; "with" names the model type, keyword or `key=` pair that
tells the type from others sharing the letter. Spectre spells by master name. Generated from
`src/catalogue/` by `npm run readme:table`.

| Element | ngspice | LTspice | PSpice | HSPICE | Xyce | Spectre | Drawn as |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ammeter | — | — | — | — | — | `iprobe` | a block titled `ammeter` |
| behavioural source | `B` | `B` | — | — | `B` | — | a block titled `B source` |
| bipolar transistor | `Q` | `Q` | `Q` | `Q` | `Q` | `bjt`, `vbic` | the `npn` symbol, or `pnp` by its model |
| capacitor | `C` | `C` | `C` | `C` | `C` | `capacitor` | the `capacitor` symbol |
| CCCS | `F` | `F` | `F` | `F` | `F` | `cccs`, `pcccs` | a block titled `CCCS` |
| CCVS | `H` | `H` | `H` | `H` | `H` | `ccvs`, `pccvs` | a block titled `CCVS` |
| code model | `A` | — | — | — | — | — | a block titled by its model type, pins as XSPICE names them |
| coupled line | `P` | — | — | — | — | — | a block titled `coupled line` |
| coupled lossy line | — | — | — | `W` | — | — | a block titled `coupled line` |
| current source | `I` | `I` | `I` | `I` | `I` | `isource` | the `isource` symbol |
| current-controlled switch | `W` | `W` | `W` | — | `W` | — | a block titled `switch` |
| delay | — | — | — | — | `YDELAY` | — | a block titled `delay` |
| digital ADC | — | — | `U` with `ADC` | — | — | — | a block titled by its keyword and arguments |
| digital adder | — | — | — | — | `U` with `ADD` | — | a block titled by its keyword and arguments |
| digital constraint | — | — | `U` with `CONSTRAINT` | — | — | — | a block titled by its keyword and arguments |
| digital DAC | — | — | `U` with `DAC` | — | — | — | a block titled by its keyword and arguments |
| digital delay line | — | — | `U` with `DLYLINE` | — | — | — | a block titled by its keyword and arguments |
| digital flip-flop | — | — | `U` with `DFF`, `JKFF`, `DFFDE`, `JKFFDE` | — | `U` with `DFF`, `JKFF`, `TFF` | — | a block titled by its keyword and arguments |
| digital gate | — | — | `U` with `BUF`, `INV`, `AND`, `NAND`, `OR`, `NOR`, `XOR`, `NXOR` | — | `U` with `BUF`, `INV`, `NOT`, `AND`, `NAND`, `OR`, `NOR`, `XOR`, `NXOR` | — | a block titled by its keyword and arguments |
| digital gate array | — | — | `U` with `BUFA`, `INVA`, `XORA`, `NXORA`, `ANDA`, `NANDA`, `ORA`, `NORA`, `AO`, `OA`, `AOI`, `OAI` | — | — | — | a block titled by its keyword and arguments |
| digital input | — | — | `N` | — | — | — | a block titled `digital input` |
| digital latch | — | — | `U` with `SRFF`, `DLTCH` | — | `U` with `DLTCH` | — | a block titled by its keyword and arguments |
| digital logic expression | — | — | `U` with `LOGICEXP` | — | — | — | a block titled by its keyword and arguments |
| digital output | — | — | `O` | — | — | — | a block titled `digital output` |
| digital pin delay | — | — | `U` with `PINDLY` | — | — | — | a block titled by its keyword and arguments |
| digital PLA | — | — | `U` with `PLAND`, `PLOR`, `PLXOR`, `PLNAND`, `PLNOR`, `PLNXOR`, `PLANDC`, `PLORC`, `PLXORC`, `PLNANDC`, `PLNORC`, `PLNXORC` | — | — | — | a block titled by its keyword and arguments |
| digital pull-up/down | — | — | `U` with `PULLUP`, `PULLDN` | — | — | — | a block titled by its keyword and arguments |
| digital RAM | — | — | `U` with `RAM` | — | — | — | a block titled by its keyword and arguments |
| digital ROM | — | — | `U` with `ROM` | — | — | — | a block titled by its keyword and arguments |
| digital stimulus | — | — | `U` with `STIM`, `FSTIM` | — | — | — | a block titled by its keyword and arguments |
| digital transfer gate | — | — | `U` with `NBTG`, `PBTG` | — | — | — | a block titled by its keyword and arguments |
| digital tristate gate | — | — | `U` with `BUF3`, `INV3`, `AND3`, `NAND3`, `OR3`, `NOR3`, `XOR3`, `NXOR3`, `BUF3A`, `INV3A`, `XOR3A`, `NXOR3A`, `AND3A`, `NAND3A`, `OR3A`, `NOR3A` | — | — | — | a block titled by its keyword and arguments |
| diode | `D` | `D` | `D` | `D` | `D` | `diode` | the `diode` symbol |
| FRA | — | `@` | — | — | — | — | a block titled `FRA` |
| FRA probe | — | `&` | — | — | — | — | a block titled `FRA probe` |
| GaAsFET | — | — | `B` | — | — | — | a block titled `GaAsFET` |
| IBIS buffer | — | — | — | `B` | — | — | a block titled `IBIS buffer` |
| IGBT | — | `Z` with a `nigbt`, `pigbt` model | `Z` | — | — | — | a block titled `IGBT`, its polarity from the model |
| inductor | `L` | `L` | `L` | `L` | `L` | `inductor` | the `inductor` symbol |
| JFET | `J` | `J` | `J` | `J` | `J` | `jfet` | a block titled `JFET`, its polarity from the model |
| lossy line (TXL) | `Y` | — | — | — | — | — | a block titled `lossy line` |
| lossy transmission line | `O` | `O` | — | — | `O` | — | a block titled `lossy line` |
| lumped lossy line | — | — | — | `U` | — | — | a block titled `lossy line` |
| lumped transmission line | — | — | — | — | `YTRANSLINE` | — | a block titled `lumped line` |
| memristor | — | — | — | — | `YMEMRISTOR` | — | a block titled `memristor` |
| MESFET | `Z` | `Z` | — | — | `Z` | `gaas` | a block titled `MESFET`, its polarity from the model |
| MOSFET | `M` | `M` | `M` | `M` | `M` | `mos1`, `mos2`, `mos3`, `bsim1`, `bsim2`, `bsim3`, `bsim3v3`, `bsim4`, `ekv`, `hisim`, `hisim2`, `psp102`, `psp103`, `bsimcmg`, `bsim6` | the `nmos` symbol, or `pmos` by its model |
| multi-position switch | — | — | — | — | — | `switch` | a block titled `switch`, pins numbered |
| multiconductor line | — | — | — | — | — | `mtline` | a block titled `coupled line`, pins numbered |
| mutual inductance | `K` | `K` | `K` | `K` | `K` | `mutual_inductor` | nothing: a coupling, noted |
| n-port | — | — | — | `S` | `YLIN` | `nport` | a block titled `n-port`, pins numbered |
| PDE device | — | — | — | — | `YPDE` | — | a block titled by its type, pins numbered |
| port | — | — | — | `P` | `P` | `port` | a block titled `port` |
| RC line | `U` | `U` | — | — | — | — | a block titled `RC line` |
| reluctor | — | — | — | `L` with `RELUCTANCE=` | — | — | a block titled `reluctor` |
| resistor | `R` | `R`; `I` with `R=`; `B` with `R=` | `R` | `R` | `R` | `resistor` | the `resistor` symbol |
| SOI MOSFET | `M` with a `b4soi`, `b3soipd`, `b3soifd`, `b3soidd`, `nsoi`, `psoi` model | — | — | — | `M` with a `nmos`, `pmos` model at level 10 or 70 or 70450 | `bsimsoi` | the `nmos` symbol, or `pmos` by its model |
| special function | — | `A` | — | — | — | — | a block titled by its keyword, a pin tied to the common not drawn |
| subcircuit | `X` | `X` | `X` | `X` | `X` | any other master | a block titled by the subcircuit or master name, pins named by the definition |
| transformer | — | — | — | — | — | `transformer` | a block titled `transformer` |
| transmission line | `T` | `T` | `T` | `T` | `T` | `tline` | a block titled `line` |
| VCCS | `G` | `G` | `G` | `G` | `G` | `vccs`, `pvccs` | a block titled `VCCS` |
| VCVS | `E` | `E` | `E` | `E` | `E` | `vcvs`, `pvcvs` | a block titled `VCVS` |
| VDMOS | `M` with a `vdmos`, `vdmosn`, `vdmosp` model | `M` with a `vdmos` model | — | — | `M` with a `nmos`, `pmos` model at level 18 | — | the `nmos3` symbol, or `pmos3` by its model |
| Verilog-A device | `N` | — | — | — | — | — | a block titled by its model type, pins numbered |
| voltage source | `V` | `V` | `V` | `V` | `V` | `vsource` | the `vsource` symbol |
| voltage-controlled switch | `S` | `S` | `S` | — | `S` | `relay` | a block titled `switch` |
| Xyce device | — | — | — | — | `Y` | — | a block titled by its type, pins numbered |

</details>

<!-- elements-by-dialect: end -->

## How the safety guarantees are met

Fence source and included files are treated as untrusted.

- **Bounded time.** The netlist reader, ELK's layout and the drawing run in a worker thread
  that `render` blocks on with `Atomics.wait`. A render past its budget terminates the worker;
  the next render starts a fresh one and waits for it under `startupTimeout` — which includes
  loading ELK and drawing a warm-up schematic — before its own budget begins. Preparation reads
  the fence and its included files with the same generated parsers in the calling thread; they
  are linear in their input, which the file limits bound.
- **Bounded memory.** The worker's JavaScript heap is capped at 256 MB, the extension's value.
  A worker that dies mid-render is reported as a `timeout` and replaced.
- **Bounded input and output.** `limits.sourceChars` is checked before the worker sees the
  source, `limits.outputBytes` on the finished SVG, and the file limits during preparation.
- **No reach outside.** `render` never touches the filesystem: it draws only what `prepare`
  read, and `prepare` reads only through the reader it is given.
- **Safe to inline, by construction.** There is no sanitizer, because nothing needs removing:
  the SVG is built through the DOM from a fixed symbol file, and the only text from the netlist
  — part names, values, titles, pin and net names — reaches it as escaped text content, never
  as markup or an attribute value. The output holds only `svg`, `g`, `path`, `circle`, `rect`
  and `text`, with geometry, class and paint attributes; the tests parse hostile netlists'
  output against that allowlist.
- **Isolated, by construction.** The output carries no `id`, no `href`, no `url()` and no
  `<style>`, so two schematics on one page have nothing to collide on and nothing to address
  outside themselves. Should a drawing ever need one, it is to be namespaced with
  `spice-<8 hex>-` from `prepared.identity`; a test fails the day an id appears.
- **Plain text out.** `message` and `notes` are the netlist reader's words; they name included
  files by the key the author wrote, never by an absolute path.

Output is deterministic: the same `Prepared` yields byte-identical SVG in any runtime.

## The parsers

Each `vendor/parsers/<dialect>.cjs` is a netlist scanner and parser for one dialect, generated
from this repository's grammars (`grammar/`) by flex and Bison and compiled to WebAssembly.
`SHA256SUMS` pins them and `provenance.json` records the tools and the SHA-256 of every input;
`test/vendor.test.ts` checks both. CI's `grammars` job rebuilds every module with the pinned
tools and fails on any byte that differs. Rebuilding them is described in `dev.md`; nothing
else needs flex, Bison or Emscripten.

## Development

```sh
npm ci
npm run lint            # tsc --noEmit
npm run compile         # tsc → dist/ (plus the symbol file), which is committed; CI fails if it is stale
npm test                # tests import dist/ and src/, so compile first
npm run test:packed     # npm pack, install into a temp project, render one fence with an include
npm run readme:table    # regenerate the elements-by-dialect table in this file from src/catalogue/
```

Requires Node 22 or later (`.nvmrc` pins the version used in development). Symbols live in
`src/skin/symbols.svg`; `test/schematic.test.ts` traces every wire of a set of reference
circuits and fails if a drawing connects the wrong pins.

## License

MIT. elkjs is EPL-2.0 and installed from npm, not bundled; symbols and layout code are adapted
from netlistsvg (MIT) — see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
