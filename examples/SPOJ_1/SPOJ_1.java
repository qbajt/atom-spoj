import java.util.Scanner;

public class SPOJ_1
{
  public static void main(String[] args)
  {
    Scanner myInput = new Scanner( System.in );

    int a;

    while(true)
    {
      a = myInput.nextInt();
      if(a==42)
      {
        break;
      }
      System.out.printf("%d\r\n", a);
    }

    myInput.close();
  }
}
