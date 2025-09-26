# read the first word (delimited by space) from each line of the file into a list

definitions = {}


def buildsubset(filename):
    res = set()
    with open(filename, 'r') as file:
        for line in file:
            word = line.split()[0]  # Get the first word in the line
            res.add(word.upper())
    return res
    
    


def readwords(ignore=False):
    words = []
    subset = buildsubset("words20k.txt")
    with open("words.txt", 'r') as file:
        for line in file:
            if hasBracket(line):
                continue
            if isPlural(line):
                continue
            first_word = line.split()[0]  # Get the first word in the line
            if ignore or (first_word in subset):
                words.append(first_word)
                definitions[first_word] = line 
    return words

def get_definition(word):
    return definitions.get(word, "Definition not found.")

def hasBracket(line):
    return '(' in line or ')' in line 

def isPlural(line):
    # if the line starts with more than one capitalized word,
    # test that the first word is the plural of the second word
    words = line.split()
    if len(words) < 2: return False
    if not words[0][0].isupper() or not words[1][0].isupper():
        return False
    # if last letter of first word is s return true
    return words[0][-1] == 'S'
 


if __name__ == "__main__":
    filename = 'words.txt'  # Replace with your file path
    word_list = readwords()