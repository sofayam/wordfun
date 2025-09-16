from collections import Counter
from typing import List, Set
from readwords import readwords
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

def example_usage():
# Sample word list (in practice, load your 200,000 words)
  
    word_list = readwords('words.txt')  # Load from file

    # Initialize finder
    finder = ScrabbleWordFinder(word_list)

    # 
    l8 = [w for w in word_list if len(w) == 8]
    random_index = randint(0, len(l8) - 1)

    # pick a random word from the list for testing
    random_word = l8[random_index]

    available_letters = random_word 
    possible_words = finder.find_possible_words(available_letters)
    # sort by length descending
    possible_words.sort(key=len)

    print(f"Available letters: {available_letters}")
    print(f"Possible words: {possible_words}")



if __name__ == "__main__":
    example_usage()

# Performance optimization tips:

# 1. Precompute letter counters for all words (done above)

# 2. Use early termination in checking

# 3. Consider using a trie data structure for very large word lists

# 4. For repeated queries, cache results

# 5. Use multiprocessing for very large datasets

# Time Complexity: O(n * m) where n is number of words, m is average word length

# Space Complexity: O(n * k) where k is average unique letters per word

# With 200,000 words, expect sub-second performance on modern hardware