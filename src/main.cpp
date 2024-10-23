#include <iostream>
#include <string>

int main() {
    std::string input;

    std::cout << "Type 'exit' to quit the program.\n";

    while (true) {
        std::cout << "> ";
        std::getline(std::cin, input);

        if (input == "exit") {
            std::cout << "Exiting...\n";
            break;  // Exit the loop if 'exit' is typed
        }

        std::cout << "You typed: " << input << "\n";
    }

    return 0;
}