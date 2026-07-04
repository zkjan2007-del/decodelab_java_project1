import java.util.Random;
import java.util.Scanner;
import java.util.InputMismatchException;
public class Main{
    public static void main(String [] args) {
        Scanner sc = new Scanner(System.in);
        Random random = new Random();

        int score = 0;
        boolean playagain;
        System.out.println("=======================================");
        System.out.println(" Welcome to DecodeLabs Number Guessing Game");
        System.out.println("=======================================");

        do {
            int target = random.nextInt(100) + 1;

            int maxAttempts = 7;     // Attempt Limiter
            int attemptsUsed = 0;
            boolean won = false;

            System.out.println("I'm thinking of a number between 1 and 100.");
            System.out.println("You have " + maxAttempts + " attempts. Good luck!");


            while (attemptsUsed < maxAttempts && !won) {
                int guess;


                try {
                    System.out.print("Attempt " + (attemptsUsed + 1) + "/" + maxAttempts + " - Enter your guess: ");
                    guess = sc.nextInt();
                    sc.nextLine();
                } catch (InputMismatchException e) {
                    System.out.println("Invalid input! Please enter a whole number.");
                    sc.nextLine();
                    continue;
                }

                attemptsUsed++;


                if (guess == target) {
                    won = true;
                    int pointsEarned = (maxAttempts - attemptsUsed + 1) * 10;
                    score += pointsEarned;
                    System.out.println("Correct! You guessed it in " + attemptsUsed + " attempt(s).");
                    System.out.println("You earned " + pointsEarned + " points!");
                } else if (guess > target) {
                    System.out.println("Too High!");
                } else {
                    System.out.println("Too Low!");
                }
            }


            if (!won) {
                System.out.println("Out of attempts! The number was: " + target);
            }

            System.out.println("Current Score: " + score);

            // Ask to play again (with input validation for Y/N)
            String response;
            do {
                System.out.print("Play Again? [Y/N]: ");
                response = sc.nextLine().trim().toUpperCase();
            } while (!response.equals("Y") && !response.equals("N"));

            playagain = response.equals("Y");

        } while (playagain);

        System.out.println("\n=======================================");
        System.out.println(" Thanks for playing! Final Score: " + score);
        System.out.println("=======================================");

        sc.close();

    }
    }
