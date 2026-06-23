# 5. Technical Details

### Platform

* **Architecture:** The project employs a modern, decoupled client-server architecture. The front-end is built as a single-page application (SPA) that communicates asynchronously with a RESTful backend server via HTTP APIs. For decentralized validation, the backend utilizes an asynchronous integration pipeline with the Polygon Amoy blockchain.
  * *Source of Evidence:* [README.md](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/README.md), [DonationController.java](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/src/main/java/viyom/donation/viyom/Controller/DonationController.java#L45-L56)
* **Supported Operating Systems:** Development, testing, and execution logs show execution on Windows 11 (64-bit) local hosts. Production environments deploy to Linux-based containers or servers.
  * *Source of Evidence:* [PERFORMANCE_EVALUATION.md](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/reports/PERFORMANCE_EVALUATION.md#L30-L33)
* **Browser Compatibility & Responsiveness:** Designed as a responsive grid with media query breakpoints (e.g., iPhone, iPad, and desktop viewports). Supported browsers include Chrome, Firefox, and Safari.
  * *Source of Evidence:* [package.json (frontend)](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/frontend/package.json#L30-L41), CSS modules in React frontend.
* **Real-time Interaction Capabilities:** Real-time updates are enabled via Spring WebSocket starters for immediate notifications or milestone progress updates.
  * *Source of Evidence:* [pom.xml](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/pom.xml#L55-L58)

### Front-end Technologies

* **React (v18.2.0)** – Main JavaScript UI library/framework used to structure the single-page application and manage UI components.
  * *Source of Evidence:* [package.json (frontend)](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/frontend/package.json#L8)
* **React Router DOM (v6.20.0)** – Client-side routing library used to manage navigation paths and switch between the donor dashboard, admin panel, and login screens without reloading the page.
  * *Source of Evidence:* [package.json (frontend)](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/frontend/package.json#L10)
* **Tailwind CSS (v3.4.1)** – A utility-first styling framework used to implement the UI layout, styling tokens, responsive grids, and dark modes.
  * *Source of Evidence:* [package.json (frontend)](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/frontend/package.json#L16), [tailwind.config.js](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/frontend/tailwind.config.js)
* **Framer Motion (v12.34.4)** – Animation library used to implement smooth UI micro-animations and page transitions.
  * *Source of Evidence:* [package.json (frontend)](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/frontend/package.json#L6)
* **jsPDF (v4.2.0)** – Client-side PDF generation utility used to build and download donation receipts on the donor dashboard.
  * *Source of Evidence:* [package.json (frontend)](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/frontend/package.json#L7)
* **Fetch API** – Native browser HTTP client API used for asynchronous requests to Spring Boot backend REST endpoints.
  * *Source of Evidence:* API integration files in React frontend source codebase.
* **HTML5 & CSS3** – Standard core structural markup and style sheet languages utilized throughout the web platform.
  * *Source of Evidence:* React component structure and frontend template source codes.

### Back-End Technologies

* **Spring Boot (v3.2.2)** – Core Java backend MVC framework used to implement dependency injection, routing controllers, security filter chains, and database repository abstractions.
  * *Source of Evidence:* [pom.xml](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/pom.xml#L5-L10)
* **Java (v17)** – Compile-time object-oriented language used to write the backend micro-services and API layers.
  * *Source of Evidence:* [pom.xml](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/pom.xml#L30)
* **REST API Architecture** – Communication architecture using Controller classes annotated with `@RestController` and `@RequestMapping` to handle JSON payloads.
  * *Source of Evidence:* [AuthController.java](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/src/main/java/viyom/donation/viyom/Controller/AuthController.java#L12-L13), [DonationController.java](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/src/main/java/viyom/donation/viyom/Controller/DonationController.java#L21-L22)
* **JJWT (v0.11.5)** – Java JWT library used for generating, parsing, and signing stateless JSON Web Tokens during authentication and subsequent authorization checks.
  * *Source of Evidence:* [pom.xml](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/pom.xml#L89-L105)
* **Razorpay Java SDK (v1.4.3)** – Official SDK integration for creating checkout order IDs and performing payment signature verification to prevent spoofing.
  * *Source of Evidence:* [pom.xml](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/pom.xml#L74-L79), [PaymentController.java](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/src/main/java/viyom/donation/viyom/Controller/PaymentController.java#L28-L35)
* **Twilio Java SDK (v10.0.0)** – Notification integration utilized to construct and send automated WhatsApp message notifications upon donation receipt.
  * *Source of Evidence:* [pom.xml](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/pom.xml#L133-L138)
* **OpenHTMLtoPDF (v1.0.10)** – HTML-to-PDF rendering utility used on the server layer for generating PDF documents using PDFBox.
  * *Source of Evidence:* [pom.xml](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/pom.xml#L140-L145)

### Blockchain Layer

* **Blockchain Network:** Polygon Amoy Testnet (Chain ID: 80002) is used as the decentralized environment to record transaction hashes, enforcing immutable ledger validation.
  * *Source of Evidence:* [APPLICATION_TESTING_REPORT.md](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/APPLICATION_TESTING_REPORT.md#L43-L46)
* **Smart Contract Language:** Solidity (v0.8.19) used to write the transparency contract containing state variables and events.
  * *Source of Evidence:* [DonationTransparency.sol](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/blockchain/contracts/DonationTransparency.sol#L2)
* **Wallet & Node Providers:** Alchemy is referenced as the primary node provider to connect with the Polygon Amoy blockchain network via RPC endpoints.
  * *Source of Evidence:* [hardhat.config.js](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/blockchain/hardhat.config.js)
* **Storage Mechanisms:** Not found in the current project artifacts (No evidence of decentralized storage like IPFS).
* **Blockchain Communication Library (Web3j v4.9.8)** – Core Java library used by the Spring Boot backend to interact with Ethereum-compatible nodes (RPC clients) and execute transaction signing.
  * *Source of Evidence:* [pom.xml](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/pom.xml#L121-L126), [RECORD_DONATION_IMPLEMENTATION.md](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/RECORD_DONATION_IMPLEMENTATION.md#L23-L29)

### Database

* **Database System (MySQL v8.0)** – Relational database management system (RDBMS) used for transactional persistence (users, sectors, pools, beneficiaries).
  * *Source of Evidence:* [pom.xml](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/pom.xml#L107-L112), [README.md](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/README.md#L44)
* **ORM Framework (Hibernate/JPA)** – Spring Data JPA starter abstraction layer used to handle relational mappings, database transactions, and execute queries.
  * *Source of Evidence:* [pom.xml](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/pom.xml#L43-L46)
* **Main Entities Stored:**
  * `AuthUser` / `Role` – Session credentials and role mapping (Admin or Donor).
  * `Donor` / `Admin` – Profile information associated with auth user.
  * `Organization` – Parent NGO containing pools and administrative users.
  * `Sector` – Broad cause categorization (e.g., Education, Health).
  * `DonationPool` – Targeted fund campaigns.
  * `Donation` – Monetary records including payment status and blockchain transaction hash.
  * `FundAllocation` – Allocation logs from pools to beneficiaries.
  * `Beneficiary` – Verified entities receiving allocations.
  * `Milestone` – Implementation project checkpoints.
  * `AuditLog` – Internal administrative actions tracker.
  * *Source of Evidence:* Entity package folder `/backend/src/main/java/viyom/donation/viyom/Entity`
* **Data Consistency Mechanisms:** Relational integrity constraints, unique email indices, foreign key references, and transactional block rollbacks managed using `@Transactional` annotations.
  * *Source of Evidence:* [Donation.java (entity)](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/src/main/java/viyom/donation/viyom/Entity/Donation.java), [FundAllocationController.java](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/src/main/java/viyom/donation/viyom/Controller/FundAllocationController.java#L70-L82)

### Libraries and Frameworks

* **Spring Security** – Security module configuration used to define CORS, disable CSRF where appropriate, configure stateless JWT filters, and protect routes via `@PreAuthorize`.
  * *Source of Evidence:* [pom.xml](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/pom.xml#L47-L50), [DonationController.java](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/src/main/java/viyom/donation/viyom/Controller/DonationController.java#L69)
* **Lombok (v1.18.30)** – Boilerplate code reduction library used to generate constructors, getters, setters, and builder patterns during compilation.
  * *Source of Evidence:* [pom.xml](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/pom.xml#L60-L65)
* **MapStruct (v1.5.5.Final)** – Compile-time annotation processor tool used to map Java Entities to DTO objects safely.
  * *Source of Evidence:* [pom.xml](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/pom.xml#L114-L119)
* **JUnit 5 & Mockito (v5.11.0)** – Frameworks utilized to write and execute unit and integration tests.
  * *Source of Evidence:* [pom.xml](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/pom.xml#L147-L165)
* **Hardhat (v2.22.17) & Ethers (v6.16.0)** – Smart contract development utility toolchain and JavaScript libraries used to compile, deploy, and test Solidity files.
  * *Source of Evidence:* [package.json (blockchain)](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/blockchain/package.json#L13-L17)
* **Springdoc OpenAPI (v2.3.0)** – Automatic API documentation tool used to generate and expose the Swagger UI.
  * *Source of Evidence:* [pom.xml](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/pom.xml#L67-L72)

### Tools and Environment

* **IDEs:** Microsoft VS Code workspace settings exist.
  * *Source of Evidence:* `.vscode` folder in project workspace root.
* **Database Tools:** MySQL command utilities used locally.
  * *Source of Evidence:* `application.properties` and MySQL setup references.
* **API Testing Tools:** Postman configuration and collection files exist in the project tree.
  * *Source of Evidence:* [Viyom_Donation_APIs.postman_collection.json](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/Viyom_Donation_APIs.postman_collection.json)
* **Blockchain Development Tools:** Hardhat is set up for compiling and verifying Smart Contracts.
  * *Source of Evidence:* [hardhat.config.js](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/blockchain/hardhat.config.js)
* **Version Control System:** Git is utilized to track modifications.
  * *Source of Evidence:* `.gitignore` and `.gitattributes` files in root directory.
* **Containerization Tools:** Not found in the current project artifacts (No Dockerfile or docker-compose configurations exist).

### Deployment Environment

* **Application Servers:** Apache Tomcat (Embedded Tomcat server inside Spring Boot starter web package) running on port `8080`.
  * *Source of Evidence:* [pom.xml](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/backend/pom.xml#L41-L42), [README.md](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/README.md#L68)
* **Operating Systems:** Supported systems include Windows (development) and Linux-based platforms (deployment host).
  * *Source of Evidence:* [README.md](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/README.md#L32), [PERFORMANCE_EVALUATION.md](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/reports/PERFORMANCE_EVALUATION.md#L32)
* **Cloud Platforms:**
  * **Vercel** – Used to host and deploy the React 18 frontend.
  * **Render** – Used to host and deploy the Spring Boot backend server.
  * *Source of Evidence:* [README.md](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/README.md#L90-L108), [vercel.json](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/frontend/vercel.json)
* **Containers and Orchestration:** Not found in the current project artifacts.
* **Network Accessibility:** Accessible via HTTP/HTTPS request mappings under `/api` routes (ports 3000 for frontend local server and 8080 for backend local server).
  * *Source of Evidence:* [README.md](file:///c:/Users/HP/Desktop/Destop/Viyom-main/Viyom-main/README.md#L68-L86)
