"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import * as Tone from "tone";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type SequencerMode = "select" | "write";

type Instrument = {
  name: string;
  sample: string;
};

const snare: Instrument = {
  name: "Snare",
  sample: "/sample/kit-snare.mp3",
};

const tom: Instrument = {
  name: "Tom",
  sample: "/sample/kit-tom.mp3",
};

const hat: Instrument = {
  name: "Hat",
  sample: "/sample/kit-hat.mp3",
};

const triangle: Instrument = {
  name: "Triangle",
  sample: "/sample/kit-triangle.mp3",
};

type SequencerStep = {
  instrument: Instrument;
  sequence: boolean[];
};

type Sequencer = SequencerStep[];

const TOTAL_STEPS = 16;

const createEmptySequence = (length: number): boolean[] => {
  return Array.from({ length }).map(() => false);
};

const initialSequencer: SequencerStep[] = [
  {
    instrument: snare,
    sequence: createEmptySequence(TOTAL_STEPS),
  },
  {
    instrument: tom,
    sequence: createEmptySequence(TOTAL_STEPS),
  },
  {
    instrument: hat,
    sequence: createEmptySequence(TOTAL_STEPS),
  },
  {
    instrument: triangle,
    sequence: createEmptySequence(TOTAL_STEPS),
  },
  {
    instrument: snare,
    sequence: createEmptySequence(TOTAL_STEPS),
  },
  {
    instrument: tom,
    sequence: createEmptySequence(TOTAL_STEPS),
  },
  {
    instrument: hat,
    sequence: createEmptySequence(TOTAL_STEPS),
  },
  {
    instrument: triangle,
    sequence: createEmptySequence(TOTAL_STEPS),
  },
  {
    instrument: snare,
    sequence: createEmptySequence(TOTAL_STEPS),
  },
  {
    instrument: tom,
    sequence: createEmptySequence(TOTAL_STEPS),
  },
  {
    instrument: hat,
    sequence: createEmptySequence(TOTAL_STEPS),
  },
  {
    instrument: triangle,
    sequence: createEmptySequence(TOTAL_STEPS),
  },
  {
    instrument: snare,
    sequence: createEmptySequence(TOTAL_STEPS),
  },
  {
    instrument: tom,
    sequence: createEmptySequence(TOTAL_STEPS),
  },
  {
    instrument: hat,
    sequence: createEmptySequence(TOTAL_STEPS),
  },
  {
    instrument: triangle,
    sequence: createEmptySequence(TOTAL_STEPS),
  },
];

export default function Sequencer() {
  const [sequencerMode, setSequencerMode] = useState<SequencerMode>("select");
  const [sequencer, setSequencer] = useState<SequencerStep[]>(initialSequencer);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInstrument, setSelectedInstrument] = useState(0);

  const samples = sequencer.map((sequencerStep) =>
    new Tone.Player(sequencerStep.instrument.sample).toDestination(),
  );

  const startPlaying = useCallback(() => {
    Tone.start();
    setIsPlaying(true);
  }, []);

  const stopPlaying = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const toggleSequencerMode = useCallback(() => {
    setSequencerMode((prev) => (prev === "select" ? "write" : "select"));
  }, []);

  const handleIsPlayingToggle = useCallback(() => {
    if (isPlaying) {
      stopPlaying();
    } else {
      startPlaying();
    }
  }, [isPlaying, startPlaying, stopPlaying]);

  const triggerInstruments = useCallback(() => {
    sequencer.forEach((instrument) => {
      if (instrument.sequence[currentStep]) {
        samples.forEach((sample, i) => {
          if (i === sequencer.indexOf(instrument)) {
            sample.start();
          }
        });
      }
    });
  }, [sequencer, currentStep, samples]);

  const toggleIntrumentSequenceStep = (
    instrumentIndex: number,
    stepIndex: number,
  ) => {
    const newInstruments = sequencer.map((instrument, i) => {
      if (i === instrumentIndex) {
        const newSequence = instrument.sequence.map((step, j) => {
          if (j === stepIndex) {
            return !step;
          }
          return step;
        });
        return { ...instrument, sequence: newSequence };
      }
      return instrument;
    });
    setSequencer(newInstruments);
  };

  const loopRef = useRef<Tone.Loop | null>(null);

  useEffect(() => {
    if (isPlaying) {
      Tone.getTransport().start(0);

      loopRef.current = new Tone.Loop(() => {
        triggerInstruments();
        setCurrentStep((prev) => (prev + 1) % TOTAL_STEPS);
      }, "4n").start(0);
    }

    return () => {
      loopRef.current?.stop();
    };
  }, [isPlaying, triggerInstruments]);

  return (
    <div>
      <Button onClick={handleIsPlayingToggle}>{isPlaying}</Button>
      <Button onClick={toggleSequencerMode}>
        {sequencerMode === "select" ? "select" : "write"}
      </Button>

      <ol className="rounded-2xl overflow-hidden grid grid-cols-4 gap-px bg-black">
        {sequencer.map((step, stepIndex) => {
          return (
            <SequenceStep
              key={stepIndex}
              stepIndex={stepIndex}
              sequencer={sequencer}
              sequencerMode={sequencerMode}
              instrument={step.instrument}
              selectedInstrument={selectedInstrument}
              sequence={step.sequence}
              currentStep={currentStep}
              handleSelect={() => {
                setSelectedInstrument(stepIndex);
                samples[stepIndex].start();
              }}
              handleWrite={() =>
                toggleIntrumentSequenceStep(selectedInstrument, stepIndex)
              }
            />
          );
        })}
      </ol>
    </div>
  );
}

type SequenceStepProps = {
  sequencer: Sequencer;
  stepIndex: number;
  sequencerMode: SequencerMode;
  currentStep: number;
  selectedInstrument: number;
  instrument: Instrument;
  sequence: boolean[];
  handleSelect: () => void;
  handleWrite: () => void;
};

const SequenceStep = ({
  sequencer,
  sequencerMode,
  currentStep,
  selectedInstrument,
  stepIndex,
  instrument,
  sequence,
  handleSelect,
  handleWrite,
}: SequenceStepProps) => {
  const isToggled = sequencer[selectedInstrument].sequence[stepIndex];

  return (
    <li className="relative bg-gray-300 aspect-square size-full flex items-center justify-center">
      {sequencerMode === "select" && (
        <Button
          onClick={handleSelect}
          className={cn("rounded-full aspect-square size-3/4")}
        >
          {instrument.name}
        </Button>
      )}

      {sequencerMode === "write" && (
        <Button
          onClick={handleWrite}
          className={cn(
            "rounded-full aspect-square size-3/4",
            isToggled && "bg-green-500",
          )}
        >
          {instrument.name}
        </Button>
      )}

      <p className="absolute bottom-1 right-1">{stepIndex}</p>
    </li>
  );
};
