package service.alert

import com.august.service.alert.AlertService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

// TODO : How to write test for this kind of class ?
class ConsoleAlertTest {
    private lateinit var sut : AlertService

    @BeforeEach
    fun setUp() {
        sut = object : AlertService {
            override fun sendAlert(message: String) {
                // Do Nothing
            }
        }
    }

    @Test
    fun alert() {

    }
}