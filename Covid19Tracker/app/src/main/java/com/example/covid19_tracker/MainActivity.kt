package com.example.covid19_tracker

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.LayoutInflater
import android.widget.ListView
import android.widget.TextView
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.TimeUnit


/** API used : https://data.covid19india.org/data.json*/
class MainActivity : AppCompatActivity() {

    lateinit var lastUpdatedtv: TextView
    lateinit var confirmedtv: TextView
    lateinit var activetv: TextView
    lateinit var recoveredtv: TextView
    lateinit var deceasedtv: TextView
    lateinit var stateAdapter: StateAdapter
    lateinit var list: ListView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        lastUpdatedtv = findViewById(R.id.lastUpdatedTv)
        confirmedtv = findViewById(R.id.confirmedTv)
        activetv = findViewById(R.id.activeTv)
        recoveredtv = findViewById(R.id.recoveredTv)!!
        deceasedtv = findViewById(R.id.deceasedTv)
        list = findViewById(R.id.list)

        list.addHeaderView(LayoutInflater.from(this).inflate(R.layout.item_header, list, false))
        fetchResults()

    }

    private fun fetchResults() {
        GlobalScope.launch {
            val response = withContext(Dispatchers.IO) { Client.api.execute() }
            if (response.isSuccessful) {
                val data = Gson().fromJson(response.body?.string(), Response::class.java)
                launch(Dispatchers.Main) {
                    bindCombinedData(data.statewise[0])
                    bindStateWiseData(data.statewise.subList(0, data.statewise.size))
                }
            }
        }

    }

    private fun bindStateWiseData(subList: List<StatewiseItem>) {
        stateAdapter = StateAdapter(subList)
        list.adapter = stateAdapter
    }

    private fun bindCombinedData(data: StatewiseItem) {

        val lastUpdatedtime = data.lastupdatedtime
        val simpleDateFormat = SimpleDateFormat("dd/MM/yy HH:mm:ss")
        lastUpdatedtv.text = "last Updated\n ${getTimeAgo(simpleDateFormat.parse(lastUpdatedtime))}"

        confirmedtv.text = data.confirmed
        activetv.text = data.active
        recoveredtv.text = data.recovered
        deceasedtv.text = data.deaths

    }

    fun getTimeAgo(past: Date): String {
        val now = Date()
        val seconds = TimeUnit.MILLISECONDS.toSeconds(now.time - past.time)
        val minutes = TimeUnit.MILLISECONDS.toMinutes(now.time - past.time)
        val hours = TimeUnit.MILLISECONDS.toHours(now.time - past.time)

        return when {
            seconds < 60 -> {
                "Few seconds ago"
            }
            minutes < 60 -> {
                "$minutes minutes ago"
            }
            hours < 24 -> {
                "$hours hour ${minutes % 60} min ago"
            }
            else -> {
                SimpleDateFormat("dd/MM/yy hh:mm a").format(past).toString()
            }
        }
    }

}