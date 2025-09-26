from collections import Counter
from typing import List, Set
from readwords import readwords
from random import randint, shuffle

class ScrabbleWordFinder:
    def __init__(self, word_list: List[str]):
        self.word_list = word_list
        # Preprocess: create letter frequency counters for all words
        self.word_counters = {}
        for word in word_list:
            self.word_counters[word] = Counter(word)

    def find_possible_words(self, available_letters: str) -> List[str]:
        """
        Find all words that can be made with the given letters.

        Args:
            available_letters: String of available letters (e.g., "HELLO")

        Returns:
            List of words that can be made
        """
        # Create counter for available letters
        available_counter = Counter(available_letters)

        possible_words = []

        # Check each word
        for word in self.word_list:
            word_counter = self.word_counters[word]
            # Check if word can be made with available letters
            if self._can_make_word(word_counter, available_counter):
                possible_words.append(word)

        return possible_words

    def _can_make_word(self, word_counter: Counter, available_counter: Counter) -> bool:
        """
        Check if a word can be made with available letters.

        Args:
            word_counter: Counter of letters needed for the word
            available_counter: Counter of available letters

        Returns:
            True if word can be made, False otherwise
        """
        # For each letter in the word, check if we have enough available
        for letter, needed_count in word_counter.items():
            if available_counter.get(letter, 0) < needed_count:
                return False
        return True



from multiprocessing import Pool
from functools import partial

# Global finder for each worker process
finder = None

def init_worker(word_list):
    """Initialize the ScrabbleWordFinder for each worker process."""
    global finder
    finder = ScrabbleWordFinder(word_list)

def process_word(word, maxwords):
    """Worker function to find sub-anagrams for a single word."""
    global finder
    words = finder.find_possible_words(word)
    words = [w for w in words if len(w) >= 3]
    if len(words) <= maxwords:
        return f"{word}: {' '.join(words)}"
    return None

def searchforgoodwords(minletters, maxletters, maxwords=30):
    word_list = readwords()
    rightlength = [w for w in word_list if len(w) <= maxletters and len(w) >= minletters]

    # Create a partial function to fix the 'maxwords' argument
    task_func = partial(process_word, maxwords=maxwords)

    # Initialize the pool with the word list for each worker
    with Pool(initializer=init_worker, initargs=(word_list,)) as pool:
        # Use imap_unordered to get results as they are ready
        results = pool.imap_unordered(task_func, rightlength)
        for result in results:
            if result:
                print(result)

if __name__ == "__main__":
    searchforgoodwords(6, 12, 40)

