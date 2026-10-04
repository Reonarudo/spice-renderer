import ammeter from './ammeter.js';
import behaviouralSource from './behavioural-source.js';
import bjt from './bjt.js';
import capacitor from './capacitor.js';
import cccs from './cccs.js';
import ccvs from './ccvs.js';
import coupledLossyLine from './coupled-lossy-line.js';
import cplLine from './cpl-line.js';
import digitalAdc from './digital-adc.js';
import digitalAdder from './digital-adder.js';
import digitalConstraint from './digital-constraint.js';
import digitalDac from './digital-dac.js';
import digitalDelayLine from './digital-delay-line.js';
import digitalFlipFlop from './digital-flip-flop.js';
import digitalGate from './digital-gate.js';
import digitalGateArray from './digital-gate-array.js';
import digitalInput from './digital-input.js';
import digitalLatch from './digital-latch.js';
import digitalLogicExpression from './digital-logic-expression.js';
import digitalOutput from './digital-output.js';
import digitalPinDelay from './digital-pin-delay.js';
import digitalPld from './digital-pld.js';
import digitalPull from './digital-pull.js';
import digitalRam from './digital-ram.js';
import digitalRom from './digital-rom.js';
import digitalStimulus from './digital-stimulus.js';
import digitalTransferGate from './digital-transfer-gate.js';
import digitalTristateGate from './digital-tristate-gate.js';
import diode from './diode.js';
import fra from './fra.js';
import fraProbe from './fra-probe.js';
import gaasfet from './gaasfet.js';
import ibisBuffer from './ibis-buffer.js';
import idealDelay from './ideal-delay.js';
import igbt from './igbt.js';
import inductor from './inductor.js';
import isource from './isource.js';
import iswitch from './iswitch.js';
import jfet from './jfet.js';
import losslessLine from './lossless-line.js';
import lossyLine from './lossy-line.js';
import ltspiceFunction from './ltspice-function.js';
import lumpedLossyLine from './lumped-lossy-line.js';
import memristor from './memristor.js';
import mesfet from './mesfet.js';
import mosfet from './mosfet.js';
import multiconductorLine from './multiconductor-line.js';
import multipositionSwitch from './multiposition-switch.js';
import mutualInductance from './mutual-inductance.js';
import nport from './nport.js';
import osdiDevice from './osdi-device.js';
import pdeDevice from './pde-device.js';
import port from './port.js';
import reluctor from './reluctor.js';
import resistor from './resistor.js';
import soiMosfet from './soi-mosfet.js';
import subcircuit from './subcircuit.js';
import transformer from './transformer.js';
import transline from './transline.js';
import txlLine from './txl-line.js';
import urcLine from './urc-line.js';
import vccs from './vccs.js';
import vcvs from './vcvs.js';
import vdmos from './vdmos.js';
import vsource from './vsource.js';
import vswitch from './vswitch.js';
import xspiceModel from './xspice-model.js';
import xyceDevice from './xyce-device.js';
const ENTRIES = {
    ammeter,
    'behavioural-source': behaviouralSource,
    bjt,
    capacitor,
    cccs,
    ccvs,
    'coupled-lossy-line': coupledLossyLine,
    'cpl-line': cplLine,
    'digital-adc': digitalAdc,
    'digital-adder': digitalAdder,
    'digital-constraint': digitalConstraint,
    'digital-dac': digitalDac,
    'digital-delay-line': digitalDelayLine,
    'digital-flip-flop': digitalFlipFlop,
    'digital-gate': digitalGate,
    'digital-gate-array': digitalGateArray,
    'digital-input': digitalInput,
    'digital-latch': digitalLatch,
    'digital-logic-expression': digitalLogicExpression,
    'digital-output': digitalOutput,
    'digital-pin-delay': digitalPinDelay,
    'digital-pld': digitalPld,
    'digital-pull': digitalPull,
    'digital-ram': digitalRam,
    'digital-rom': digitalRom,
    'digital-stimulus': digitalStimulus,
    'digital-transfer-gate': digitalTransferGate,
    'digital-tristate-gate': digitalTristateGate,
    diode,
    fra,
    'fra-probe': fraProbe,
    gaasfet,
    'ibis-buffer': ibisBuffer,
    'ideal-delay': idealDelay,
    igbt,
    inductor,
    isource,
    iswitch,
    jfet,
    'lossless-line': losslessLine,
    'lossy-line': lossyLine,
    'ltspice-function': ltspiceFunction,
    'lumped-lossy-line': lumpedLossyLine,
    memristor,
    mesfet,
    mosfet,
    'multiconductor-line': multiconductorLine,
    'multiposition-switch': multipositionSwitch,
    'mutual-inductance': mutualInductance,
    nport,
    'osdi-device': osdiDevice,
    'pde-device': pdeDevice,
    port,
    reluctor,
    resistor,
    'soi-mosfet': soiMosfet,
    subcircuit,
    transformer,
    transline,
    'txl-line': txlLine,
    'urc-line': urcLine,
    vccs,
    vcvs,
    vdmos,
    vsource,
    vswitch,
    'xspice-model': xspiceModel,
    'xyce-device': xyceDevice
};
/** Every element type by id. */
export const CATALOGUE = ENTRIES;
export const ELEMENT_TYPE_IDS = Object.keys(CATALOGUE);
export function elementType(id) {
    return CATALOGUE[id];
}
function selects(select, hints) {
    switch (select.by) {
        case 'model-type':
            return hints.modelType !== undefined && select.types.includes(hints.modelType)
                && (select.levels === undefined || (hints.modelLevel !== undefined && select.levels.includes(hints.modelLevel)));
        case 'suffix':
            return hints.suffix !== undefined && select.suffixes.includes(hints.suffix);
        case 'keyword':
            return hints.keywords !== undefined && select.keywords.some((keyword) => hints.keywords.includes(keyword));
        case 'pair':
            return hints.pairKeys !== undefined && select.keys.some((key) => hints.pairKeys.includes(key.toUpperCase()));
    }
}
/** Every (type, spelling) pair of one dialect. */
export function spellingsOf(dialect) {
    const found = [];
    for (const id of ELEMENT_TYPE_IDS) {
        for (const spelling of CATALOGUE[id].spellings) {
            if (spelling.dialect === dialect)
                found.push({ id, spelling });
        }
    }
    return found;
}
/**
 * The element type a SPICE dialect's letter names, given what the line and its model say. Types
 * whose selector matches win over the letter's fallback; `undefined` when the dialect has no such
 * letter.
 */
export function elementTypeForLetter(dialect, letter, hints = {}) {
    const upper = letter.toUpperCase();
    let fallback;
    for (const { id, spelling } of spellingsOf(dialect)) {
        if (spelling.dialect === 'spectre' || spelling.letter !== upper)
            continue;
        if (spelling.select === undefined)
            fallback = id;
        else if (selects(spelling.select, hints))
            return id;
    }
    return fallback;
}
/** The element type a Spectre master names; a master the catalogue does not know is a subcircuit or module. */
export function elementTypeForMaster(master) {
    let fallback = 'subcircuit';
    for (const { id, spelling } of spellingsOf('spectre')) {
        if (spelling.dialect !== 'spectre')
            continue;
        if (spelling.master === master)
            return id;
        if (spelling.master === '*')
            fallback = id;
    }
    return fallback;
}
