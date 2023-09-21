'use client';
import useBoardStore from '@/store/boardStore';
import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import moment from 'moment';
import { Fragment } from 'react';
import { BiTimeFive } from 'react-icons/bi';
import { HiMiniSpeakerWave } from 'react-icons/hi2';
import { MdUpdate } from 'react-icons/md';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import useUIStore from '@/store/uiStore';
type Props = {};

const ViewWordModal = (props: Props) => {
  const [viewWordModalOpen, toggleViewWordModal, focusedWord] = useUIStore(
    (state) => [
      state.viewWordModalOpen,
      state.toggleViewWordModal,
      state.focusedWord,
    ]
  );

  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  );
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(focusedWord?.word);

    setUtterance(u);
    setSynth(synth);

    return () => {
      synth.cancel();
    };
  }, [focusedWord]);

  return (
    <>
      <Transition show={viewWordModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => toggleViewWordModal(null)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col relative justify-center space-y-6 flex-1">
                    <div className="relative w-full aspect-square">
                      <Image
                        src={
                          focusedWord?.image || '/assets/board-placeholder.svg'
                        }
                        alt={focusedWord?.word || 'Word image'}
                        fill
                        objectFit="cover"
                      />
                    </div>

                    <div className="">
                      <span className="text-xs uppercase">
                        {focusedWord?.partOfSpeech?.join(', ')}
                      </span>
                      <h3 className="text-3xl font-bold space-x-2">
                        <span>{focusedWord?.word}</span>
                        <HiMiniSpeakerWave
                          onClick={() => synth?.speak(utterance!)}
                          className="inline text-gray-400 cursor-pointer"
                        />
                      </h3>
                      <p className="">{focusedWord?.meaning}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <BiTimeFive className="text-xl" />
                        <time className="text-gray-500 flex flex-col text-xs">
                          <span className="font-semibold text-gray-900">
                            Created At:{' '}
                          </span>
                          <span className="whitespace-nowrap">
                            {moment(focusedWord?.createdAt?.toDate()).format(
                              'MMM Do YYYY'
                            )}
                          </span>
                        </time>
                      </div>

                      <div className="flex items-center space-x-1">
                        <MdUpdate className="text-xl" />
                        <time className="text-gray-500 flex flex-col text-xs">
                          <span className="font-semibold text-gray-900">
                            Updated At:{' '}
                          </span>
                          <span className="whitespace-nowrap">
                            {moment(focusedWord?.updatedAt.toDate()).format(
                              'MMMM Do YYYY'
                            )}
                          </span>
                        </time>
                      </div>
                    </div>

                    <div className="space-y-1 w-full">
                      <h4 className="text-sm font-bold">Root Word(s): </h4>
                      <ul className="space-x-2 overflow-x-auto text-sm text-gray-900 font-medium cursor-pointer list-inside list-none flex items-center">
                        {focusedWord?.roots && focusedWord?.roots.length > 0 ? (
                          focusedWord?.roots.map((root) => (
                            <li
                              key={root.value}
                              className="px-2 py-0.5 transition-all ease-in-out duration-300 bg-gray-200 hover:bg-gray-300 rounded-lg"
                            >
                              {root.label}
                            </li>
                          ))
                        ) : (
                          <div className="text-gray-500">
                            No Root Word(s) Provided.
                          </div>
                        )}
                      </ul>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold">Examples: </h4>
                      <ol className="space-y-1 text-sm text-gray-500 list-inside list-decimal">
                        {focusedWord?.examples &&
                        focusedWord?.examples.length > 0 ? (
                          focusedWord?.examples.map((example, idx) => (
                            <li key={idx} className="space-x-1">
                              {example.split(' ').map((w, idx) => (
                                <span
                                  key={idx}
                                  className={classNames(
                                    'inline-block',
                                    w
                                      .toLowerCase()
                                      .match(focusedWord?.word.toLowerCase())
                                      ? 'font-bold text-black'
                                      : ''
                                  )}
                                >
                                  {w}
                                </span>
                              ))}
                            </li>
                          ))
                        ) : (
                          <div className="">No Examples Provided.</div>
                        )}
                      </ol>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-4">
                    <button
                      onClick={() => toggleViewWordModal(null)}
                      className="modalBtnPrev"
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ViewWordModal;
