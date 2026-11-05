# Changelog

Notable changes to `@reonarudo/spice-renderer`, in the
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format. Versions follow
[Releasing](http://192.168.188.68:3001/projects/markdown-renderers/wiki/Releasing): any change to the SVG a fence draws is
at least a minor version.

## [Unreleased]

## [1.1.0] — 2026-11-06

### Added

- `bom`: the fence's parts aggregated into bill-of-materials rows (`BomRow`, `BomReference`),
  returned beside the SVG on `success`. Two parts share a row when their type, title and value
  tail match after case folding and whitespace collapsing; rows are in first-reference order;
  the quantity is the number of references and does not count `m=`.
- The two-phase reply ([ADR 0001](docs/adr/0001-two-phase-reply.md)): the worker writes the rows
  and the reader's notes to the shared buffer before layout, so a `timeout` and a layout
  `failure` carry `bom` and `notes` whenever the netlist was read. A netlist error carries neither.

### Changed

- `notes` are now part of the parsed stage: present on `timeout` and on a layout `failure`, not
  only on `success`. `Prepared`, `identity`, `prepare` and the SVG are unchanged.

## [1.0.0] — 2026-10-21

### Added

- Releases: every version is an immutable GitHub Release whose one asset is the `npm pack`
  tarball. Depend on its URL, with `allow-remote=root` in `.npmrc`, instead of a git tag.
- Golden SVG tests for every spice fence in the site's showcase and the extension's demos.
  Every fence draws byte-identical SVG to v0.1.0.

[Unreleased]: https://github.com/Reonarudo/spice-renderer/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/Reonarudo/spice-renderer/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Reonarudo/spice-renderer/compare/v0.1.0...v1.0.0
