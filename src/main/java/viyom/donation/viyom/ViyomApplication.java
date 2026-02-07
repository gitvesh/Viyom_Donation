package viyom.donation.viyom;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ViyomApplication {

	public static void main(String[] args) {
		SpringApplication.run(ViyomApplication.class, args);
	}

}
