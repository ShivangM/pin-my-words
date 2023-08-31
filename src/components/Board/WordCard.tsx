import { Word } from '@/interfaces/Word.d';
import classNames from 'classnames';
import Image from 'next/image';

const WordsCard = ({ word, idx }: { word: Word; idx: number }) => {
  return (
    <div
      className={classNames(
        'flex flex-col overflow-hidden bg-gray-100 rounded-md shadow-sm',
        idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
      )}
    >
      <div className="relative h-80 aspect-square">
        <Image
          src={word.image || '/assets/board-placeholder.svg'}
          alt={word.word}
          fill
          objectFit="cover"
        />
      </div>

      <div className="flex flex-col justify-center flex-1 p-6">
        <span className="text-xs uppercase">NOUN</span>
        <h3 className="text-3xl font-bold">{word.word}</h3>
        <p className="my-6">{word.definition}</p>
        <button type="button" className="self-start">
          View More
        </button>
      </div>
    </div>
  );
};

export default WordsCard;
