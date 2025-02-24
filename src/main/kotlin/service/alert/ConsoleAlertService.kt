package com.august.service.alert

class ConsoleAlertService: AlertService {
    override fun sendAlert(message: String) {
        println("ALERT : $message")
    }
}