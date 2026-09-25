package tech.abhiram.loompay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LoompayApplication {

	public static void main(String[] args) {
		SpringApplication.run(LoompayApplication.class, args);
	}

}
