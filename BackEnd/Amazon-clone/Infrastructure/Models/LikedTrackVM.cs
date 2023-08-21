﻿using DAL.Entities.Music;
using DAL.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Models
{
    public class LikedTrackVM
    {
        public TrackVM Track { get; set; }
        public int? UserId { get; set; }
    }
}
