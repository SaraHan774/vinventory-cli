plugins {
    kotlin("jvm") version "2.0.20"
    application
}

group = "com.august"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

application {
    mainClass.set("com.august.MainKt")
    applicationDefaultJvmArgs = listOf("-Xmx512m", "-Xms256m")
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
    implementation("io.insert-koin:koin-core:3.5.3")
    
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.10.1")
    testImplementation("io.mockk:mockk:1.13.16")
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.2")
    testImplementation("io.insert-koin:koin-test:3.5.3") {
        exclude(group = "org.jetbrains.kotlin", module = "kotlin-test-junit")
    }
}

tasks.test {
    useJUnitPlatform()
}

tasks.jar {
    manifest {
        attributes["Main-Class"] = "com.august.MainKt"
    }
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
    from(configurations.runtimeClasspath.get().map { if (it.isDirectory) it else zipTree(it) })
}

kotlin {
    jvmToolchain(17)
}