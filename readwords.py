# read the first word (delimited by space) from each line of the file into a list

definitions = {}

def readwords(filename = 'words.txt'):
    words = []
    with open(filename, 'r') as file:
        for line in file:
            first_word = line.split()[0]  # Get the first word in the line
            words.append(first_word)
            definitions[first_word] = line 
    return words

def get_definition(word):
    return definitions.get(word, "Definition not found.")


if __name__ == "__main__":
    filename = 'words.txt'  # Replace with your file path
    word_list = readwords(filename)