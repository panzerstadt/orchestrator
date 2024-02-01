package main

import (
	"fmt"
	"net/http"
	"time"
)

type urlStatus struct {
	url    string
	status bool
}

func main() {
	urls := []string{
		"www.easyjet.com",
		"www.skyscanner.com",
		"www.ryanair.com",
		"wizzair.com",
		"www.swiss.com",
		"www.google.com",
		"www.airasia.com",
		"dev.to",
		"www.gmail.com",
		"www.bing.com",
		"www.medium.com",
		"www.theverge.com",
		"www.polygon.com",
		"www.twitter.com",
		"www.youtube.com",
		"www.vercel.com",
	}

	for {

		ch := make(chan urlStatus)
		for _, url := range urls {
			go checkUrl("https://"+url, ch)
		}
		result := make([]urlStatus, len(urls))

		for i, _ := range result {
			result[i] = <-ch
			if result[i].status {
				fmt.Println(result[i].url, "is up")
			} else {
				fmt.Println(result[i].url, "is down!")
			}
		}

		time.Sleep(60 * time.Second)

	}

}

func checkUrl(url string, ch chan urlStatus) {
	_, err := http.Get(url)
	if err != nil {
		// fmt.Println("error", err)
		ch <- urlStatus{url: url, status: false}
		return
	}
	ch <- urlStatus{url: url, status: true}
}
