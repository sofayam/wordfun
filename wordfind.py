from collections import Counter
from typing import List, Set
from readwords import readwords, get_definition
from random import randint

class ScrabbleWordFinder:
    def __init__(self, word_list: List[str]):
    

        self.word_list = word_list
        # Preprocess: create letter frequency counters for all words
        self.word_counters = {}
        for word in word_list:
        # Convert to lowercase and create counter
            word_lower = word.lower()
            self.word_counters[word_lower] = Counter(word_lower)


    def find_possible_words(self, available_letters: str) -> List[str]:
        """
    Find all words that can be made with the given letters.
    
    Args:
        available_letters: String of available letters (e.g., "hello")
    
    Returns:
        List of words that can be made
        """
        # Create counter for available letters
        available_counter = Counter(available_letters.lower())
    
        possible_words = []
    
        # Check each word
        for word in self.word_list:
            word_lower = word.lower()
            word_counter = self.word_counters[word_lower]
        
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


# Usage example and performance comparison

def generate(min_length=3, max_length=8, max_words=20):
# Sample word list (in practice, load your 200,000 words)
  
    word_list = readwords('words.txt')  # Load from file

    # Initialize finder
    finder = ScrabbleWordFinder(word_list)

    # 
    candidates = [w for w in word_list if len(w) == max_length]
    random_index = randint(0, len(candidates) - 1)

    # pick a random word from the list for testing
    winner = candidates[random_index]

    possible_words = finder.find_possible_words(winner)
    # sort by length descending
    possible_words.sort(key=len)

    print(f"Available letters: {winner}")
    print(f"Possible words: {possible_words}")

    # choose max_words words with a spread of lengths from the list of possible words
    chosen_words = []
    lengths = list(range(min_length, max_length + 1))
    length_word_lists = [ [w for w in possible_words if len(w) == length] for length in lengths ]
    picked_indices = [0] * len(lengths)

    while len(chosen_words) < max_words:
        added = False
        for i, word_list in enumerate(length_word_lists):
            idx = picked_indices[i]
            if idx < len(word_list):
                chosen_words.append(word_list[idx])
                picked_indices[i] += 1
                added = True
                if len(chosen_words) >= max_words:
                    break
        if not added:
            break  # No more words to add

    chosen_words.sort(key=len)

    print(f"Chosen words (spread): {chosen_words}")

    letters = ''.join(sorted(winner))
    chosen_word_dict = {w: get_definition(w) for w in chosen_words}

    return (letters, chosen_word_dict)


if __name__ == "__main__":
    print (generate(3, 8, 20))

